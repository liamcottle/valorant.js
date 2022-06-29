"use strict";

const axios = require("axios").default;
const { Agent } = require("https");

const regions = require("./regions");

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

const parseTokensFromUrl = (uri) => {
  let url = new URL(uri);
  let params = new URLSearchParams(url.hash.substring(1));
  return {
    access_token: params.get("access_token"),
    id_token: params.get("id_token"),
  };
};

class API {
  constructor(region = regions.AsiaPacific) {
    this.region = region;
    this.username = null;
    this.user_id = null;
    this.access_token = null;
    this.entitlements_token = null;
    this.user_agent = "RiotClient/43.0.1.4195386.4190634 rso-auth (Windows; 10;;Professional, x64)";
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

  async authorize(username, password) {
    // fetch session cookie
    const cookie = (
      await axios.post(
        "https://auth.riotgames.com/api/v1/authorization",
        {
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
        }
      )
    ).headers["set-cookie"].find((elem) => /^asid/.test(elem));

    // fetch auth tokens
    var access_tokens = await axios.put(
      "https://auth.riotgames.com/api/v1/authorization",
      {
        type: "auth",
        username: username,
        password: password,
      },
      {
        headers: {
          "Cookie": cookie,
          "User-Agent": this.user_agent,
        },
        httpsAgent: agent,
      }
    );

    // throw exception for auth_failure
    if(access_tokens.data?.error === 'auth_failure'){
      throw new Error("auth_failure: username or password is incorrect.");
    }

    // update access token
    var tokens = parseTokensFromUrl(access_tokens.data.response.parameters.uri);
    this.access_token = tokens.access_token;

    // fetch entitlements token
    this.entitlements_token = (
      await axios.post(
        "https://entitlements.auth.riotgames.com/api/token/v1",
        {},
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        }
      )
    ).data.entitlements_token;

    // update user_id from access_token
    this.user_id = JSON.parse(
      Buffer.from(tokens.access_token.split(".")[1], "base64").toString()
    ).sub;
  }

  getConfig(region = this.region) {
    return axios.get(
      this.getSharedDataServiceUrl(region) + "/v1/config/" + region
    );
  }

  getContent() {
    return axios.get(
      this.getSharedDataServiceUrl(this.region) + "/content-service/v2/content",
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getEntitlements(playerId) {
    return axios.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/store/v1/entitlements/${playerId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getMatch(matchId) {
    return axios.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/match-details/v1/matches/${matchId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getParty(partyId) {
    return axios.get(
      this.getPartyServiceUrl(this.region) + `/parties/v1/parties/${partyId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getPartyByPlayer(playerId) {
    return axios.get(
      this.getPartyServiceUrl(this.region) + `/parties/v1/players/${playerId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getCompetitiveLeaderboard(seasonId, startIndex = 0, size = 510) {
    return axios.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/mmr/v1/leaderboards/affinity/${this.region}/queue/competitive/season/${seasonId}?startIndex=${startIndex}&size=${size}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getPlayerLoadout(playerId) {
    return axios.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/personalization/v2/players/${playerId}/playerloadout`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getPlayerMMR(playerId) {
    return axios.get(
      this.getPlayerDataServiceUrl(this.region) + `/mmr/v1/players/${playerId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getPlayerMatchHistory(playerId, startIndex = 0, endIndex = 10) {
    return axios.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/match-history/v1/history/${playerId}?startIndex=${startIndex}&endIndex=${endIndex}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getPlayerCompetitiveHistory(playerId, startIndex = 0, endIndex = 10) {
    return axios.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/mmr/v1/players/${playerId}/competitiveupdates?startIndex=${startIndex}&endIndex=${endIndex}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getPlayerAccountXp(playerId) {
    return axios.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/account-xp/v1/players/${playerId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getPlayerWallet(playerId) {
    return axios.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/store/v1/wallet/${playerId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getPlayerStoreFront(playerId) {
    return axios.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/store/v2/storefront/${playerId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getPlayers(playerIds) {
    return axios.put(
      this.getPlayerDataServiceUrl(this.region) + "/name-service/v2/players",
      playerIds,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getSession(playerId) {
    return axios.get(
      this.getPartyServiceUrl(this.region) + `/session/v1/sessions/${playerId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getContractDefinitions() {
    return axios.get(
      this.getPlayerDataServiceUrl(this.region) +
        "/contract-definitions/v2/definitions",
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getStoryContractDefinitions() {
    return axios.get(
      this.getPlayerDataServiceUrl(this.region) +
        "/contract-definitions/v2/definitions/story",
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getStoreOffers() {
    return axios.get(
      this.getPlayerDataServiceUrl(this.region) + `/store/v1/offers`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getContract(playerId) {
    return axios.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/contracts/v1/contracts/${playerId}`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getItemUpgradesV2() {
    return axios.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/contract-definitions/v2/item-upgrades`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }

  getItemUpgradesV3() {
    return axios.get(
      this.getPlayerDataServiceUrl(this.region) +
        `/contract-definitions/v3/item-upgrades`,
      {
        headers: this.generateRequestHeaders(),
      }
    );
  }
}

module.exports = API;
