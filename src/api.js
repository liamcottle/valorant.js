"use strict";

const axios = require("axios").default;
const { Agent } = require("https");
const prompt = require("prompt");

const Errors = require("./errors");
const Regions = require("./regions");

// create https agent with expected ciphers to avoid 403 from cloudflare
const agent = new Agent({
  ciphers: [
    "TLS_CHACHA20_POLY1305_SHA256",
    "TLS_AES_128_GCM_SHA256",
    "TLS_AES_256_GCM_SHA384",
    "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256",
  ].join(":"),
  honorCipherOrder: true,
  minVersion: "TLSv1.2",
});

const parseSessionCookie = (response) => {
  return response.headers["set-cookie"].find((elem) => /^asid/.test(elem));
}

const parseTokensFromUrl = (uri) => {
  let url = new URL(uri);
  let params = new URLSearchParams(url.hash.substring(1));
  return {
    access_token: params.get("access_token"),
    id_token: params.get("id_token"),
  };
};

const parseUserIdFromAccessToken = (accessToken) => {
  const jwt = accessToken.split(".");
  const payload = Buffer.from(jwt[1], "base64").toString();
  const json = JSON.parse(payload);
  return json.sub;
};

class API {
  constructor(region = Regions.AsiaPacific) {
    this.region = region;
    this.username = null;
    this.user_id = null;
    this.access_token = null;
    this.entitlements_token = null;
    this.user_agent = "RiotClient/43.0.1.4195386.4190634 rso-auth (Windows; 10;;Professional, x64)";
    this.axiosClient = axios.create();
    this.client_version = "release-05.00-shipping-6-725355";
    this.client_platform = {
      platformType: "PC",
      platformOS: "Windows",
      platformOSVersion: "10.0.19042.1.256.64bit",
      platformChipset: "Unknown",
    };
  }

  getPlayerDataServiceUrl(region) {
    return `https://pd.${region}.a.pvp.net`;
  }

  getPartyServiceUrl(region) {
    return `https://glz-${region}-1.${region}.a.pvp.net`;
  }

  getSharedDataServiceUrl(region) {
    return `https://shared.${region}.a.pvp.net`;
  }

  generateRequestHeaders(extraHeaders = {}) {
    // generate default headers
    const defaultHeaders = {
      Authorization: `Bearer ${this.access_token}`,
      "X-Riot-Entitlements-JWT": this.entitlements_token,
      "X-Riot-ClientVersion": this.client_version,
      "X-Riot-ClientPlatform": Buffer.from(
        JSON.stringify(this.client_platform)
      ).toString("base64"),
    };

    // merge in extra headers
    return {
      ...defaultHeaders,
      ...extraHeaders,
    };
  }

  async getNewSessionCookie() {

    // fetch session cookie
    const response = await this.axiosClient.post("https://auth.riotgames.com/api/v1/authorization", {
          client_id: "play-valorant-web-prod",
          nonce: 1,
          redirect_uri: "https://playvalorant.com/opt_in",
          response_type: "token id_token",
          scope: "account openid",
        },
        {
          headers: {
            "User-Agent": this.user_agent,
          },
          httpsAgent: agent,
        },
    );

    return parseSessionCookie(response);

  }

  async getEntitlementsToken(accessToken) {

    // fetch entitlements token
    const response = await this.axiosClient.post(
        "https://entitlements.auth.riotgames.com/api/token/v1",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
    );

    return response.data.entitlements_token;

  }

  async authorize(username, password) {
    return this.authWithCredentials(username, password);
  }

  async authWithCredentials(username, password) {

    // fetch initial session cookie
    this.cookie = await this.getNewSessionCookie();

    // authenticate with credentials
    const response = await this.axiosClient.put("https://auth.riotgames.com/api/v1/authorization", {
          type: "auth",
          username: username,
          password: password,
        }, {
          headers: {
            "Cookie": this.cookie,
            "User-Agent": this.user_agent,
          },
          httpsAgent: agent,
        },
    );

    return this._handleAuthResponse(response);

  }

  async authWithMultifactorCode(code) {

    // authenticate with multifactor code
    const response = await this.axiosClient.put("https://auth.riotgames.com/api/v1/authorization", {
          type: "multifactor",
          code: code.toString(), // should always be a string
          rememberDevice: false,
        },
        {
          headers: {
            "Cookie": this.cookie,
            "User-Agent": this.user_agent,
          },
          httpsAgent: agent,
        },
    );

    return this._handleAuthResponse(response);

  }

  async _handleAuthResponse(response) {

    // update session cookie
    this.cookie = await parseSessionCookie(response);

    // throw exception for auth_failure
    if(response.data?.error === 'auth_failure'){
      throw new Errors.AuthFailureError();
    }

    // throw exception if multifactor auth is required
    if(response.data?.type === 'multifactor'){

      // get multifactor info from response
      const multifactor = response.data?.multifactor;

      // check if multifactor attempt failed
      if(response.data?.error === 'multifactor_attempt_failed'){
        throw new Errors.MultifactorAuthAttemptFailedError(multifactor);
      }

      // fallback to multifactor auth required error
      throw new Errors.MultifactorAuthRequiredError(multifactor);

    }

    // throw exception if tokens are missing from response
    if(response.data?.response?.parameters?.uri === null){
      throw new Errors.APIError("Auth tokens are is missing from auth response.");
    }

    // parse tokens from response
    const tokens = parseTokensFromUrl(response.data.response.parameters.uri);

    // update tokens
    this.access_token = tokens.access_token;
    this.user_id = parseUserIdFromAccessToken(tokens.access_token);
    this.entitlements_token = await this.getEntitlementsToken(this.access_token);

  }

  /**
   * Prompt the caller to enter a multifactor code. If the wrong code is entered, it will keep asking
   * until the correct code is entered, or the server returns some other error that is not handled here.
   * Note: This will only work from the command line.
   * @return {Promise<void>}
   */
  async showMultifactorAuthPrompt(multifactor) {

    // determine which email the mfa code was sent to
    const email = multifactor.email ?? 'unknown email';

    // ask user for multifactor code
    const {code} = await prompt.get([{
      name: 'code',
      description: `Enter MFA code sent to ${email}`,
    }]);

    // submit multifactor code
    return this.authWithMultifactorCode(code).catch((e) => {

      // if multifactor attempt failed, prompt for code again
      if(e instanceof Errors.MultifactorAuthAttemptFailedError){
        console.error(e.message);
        return this.showMultifactorAuthPrompt(e.multifactor);
      }

      // rethrow unhandled error
      throw e;

    });

  }

  getConfig(region = this.region) {
    return this.axiosClient.get(
      this.getSharedDataServiceUrl(region) + "/v1/config/" + region
    );
  }

  getContent() {
    return this.axiosClient.get(
      this.getSharedDataServiceUrl(this.region) + "/content-service/v2/content",
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getEntitlements(playerId) {
    return this.axiosClient.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/store/v1/entitlements/${playerId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getMatch(matchId) {
    return this.axiosClient.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/match-details/v1/matches/${matchId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getParty(partyId) {
    return this.axiosClient.get(
      this.getPartyServiceUrl(this.region) + `/parties/v1/parties/${partyId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getPartyByPlayer(playerId) {
    return this.axiosClient.get(
      this.getPartyServiceUrl(this.region) + `/parties/v1/players/${playerId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getCompetitiveLeaderboard(seasonId, startIndex = 0, size = 510) {
    return this.axiosClient.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/mmr/v1/leaderboards/affinity/${this.region}/queue/competitive/season/${seasonId}?startIndex=${startIndex}&size=${size}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getPlayerLoadout(playerId) {
    return this.axiosClient.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/personalization/v2/players/${playerId}/playerloadout`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getPlayerMMR(playerId) {
    return this.axiosClient.get(
      this.getPlayerDataServiceUrl(this.region) + `/mmr/v1/players/${playerId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getPlayerMatchHistory(playerId, startIndex = 0, endIndex = 10) {
    return this.axiosClient.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/match-history/v1/history/${playerId}?startIndex=${startIndex}&endIndex=${endIndex}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getPlayerCompetitiveHistory(playerId, startIndex = 0, endIndex = 10) {
    return this.axiosClient.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/mmr/v1/players/${playerId}/competitiveupdates?startIndex=${startIndex}&endIndex=${endIndex}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getPlayerAccountXp(playerId) {
    return this.axiosClient.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/account-xp/v1/players/${playerId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getPlayerWallet(playerId) {
    return this.axiosClient.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/store/v1/wallet/${playerId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getPlayerStoreFront(playerId) {
    return this.axiosClient.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/store/v2/storefront/${playerId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getPlayers(playerIds) {
    return this.axiosClient.put(
      this.getPlayerDataServiceUrl(this.region) + "/name-service/v2/players",
      playerIds,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getSession(playerId) {
    return this.axiosClient.get(
      this.getPartyServiceUrl(this.region) + `/session/v1/sessions/${playerId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getContractDefinitions() {
    return this.axiosClient.get(
      this.getPlayerDataServiceUrl(this.region) +
        "/contract-definitions/v2/definitions",
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getStoryContractDefinitions() {
    return this.axiosClient.get(
      this.getPlayerDataServiceUrl(this.region) +
        "/contract-definitions/v2/definitions/story",
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getStoreOffers() {
    return this.axiosClient.get(
      this.getPlayerDataServiceUrl(this.region) + `/store/v1/offers`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getContract(playerId) {
    return this.axiosClient.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/contracts/v1/contracts/${playerId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getItemUpgradesV2() {
    return this.axiosClient.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/contract-definitions/v2/item-upgrades`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getItemUpgradesV3() {
    return this.axiosClient.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/contract-definitions/v3/item-upgrades`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }
}

module.exports = API;
