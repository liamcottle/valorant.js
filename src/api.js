"use strict";

const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const querystring = require('querystring');
const tough = require('tough-cookie');
const url = require('url');

const regions = require('./regions');

axiosCookieJarSupport(axios);

class API {

    constructor(region = regions.AsiaPacific) {
        this.region = region;
        this.username = null;
        this.user_id = null;
        this.access_token = null;
        this.entitlements_token = null;
        this.client_version = 'release-02.00-shipping-16-508517';
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

    authorize(username, password) {

        const cookieJar = new tough.CookieJar();

        return axios.post('https://auth.riotgames.com/api/v1/authorization', {
            'client_id': 'play-valorant-web-prod',
            'nonce': '1',
            'redirect_uri': 'https://playvalorant.com/opt_in',
            'response_type': 'token id_token',
        },{
            jar: cookieJar,
            withCredentials: true,
        }).then(() => {
            return axios.put('https://auth.riotgames.com/api/v1/authorization', {
                'type': 'auth',
                'username': username,
                'password': password,
            },{
                jar: cookieJar,
                withCredentials: true,
            }).then((response) => {

                // check for error
                if(response.data.error){
                    throw new Error(response.data.error);
                }

                // parse uri
                var parsedUrl = url.parse(response.data.response.parameters.uri);

                // strip # from hash
                var hash = parsedUrl.hash.replace('#', '');

                // parse query string from hash
                var parts = querystring.parse(hash);

                // return access token
                return parts.access_token
            });
        }).then((access_token) => {
            return axios.post('https://entitlements.auth.riotgames.com/api/token/v1',{},{
                jar: cookieJar,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                },
            }).then((response) => {
                this.username = username;
                this.access_token = access_token;
                this.entitlements_token = response.data.entitlements_token;
            });
        }).then(() => {
            return axios.post('https://auth.riotgames.com/userinfo',{},{
                jar: cookieJar,
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${this.access_token}`,
                },
            }).then((response) => {
                this.user_id = response.data.sub;
            });
        });
    }

    getConfig(region = this.region) {
        return axios.get(this.getSharedDataServiceUrl(region) + '/v1/config/' + region);
    }

    getContent() {
        return axios.get(this.getSharedDataServiceUrl(this.region) + '/content-service/v2/content', {
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
                'X-Riot-ClientVersion': this.client_version,
            },
        });
    }

    getMatch(matchId) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/match-details/v1/matches/${matchId}`,{
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
            },
        });
    }

    getParty(partyId) {
        return axios.get(this.getPartyServiceUrl(this.region) + `/parties/v1/parties/${partyId}`,{
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
                'X-Riot-ClientVersion': this.client_version,
            },
        });
    }

    getPartyByPlayer(playerId) {
        return axios.get(this.getPartyServiceUrl(this.region) + `/parties/v1/players/${playerId}`,{
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
                'X-Riot-ClientVersion': this.client_version,
            },
        });
    }

    getCompetitiveLeaderboard(seasonId) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/mmr/v1/leaderboards/affinity/${this.region}/queue/competitive/season/${seasonId}`,{
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
                'X-Riot-ClientVersion': this.client_version,
            },
        });
    }

    getPlayerLoadout(playerId) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/personalization/v2/players/${playerId}/playerloadout`,{
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
            },
        });
    }

    getPlayerMMR(playerId) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/mmr/v1/players/${playerId}`,{
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
                'X-Riot-ClientVersion': this.client_version,
            },
        });
    }

    getPlayerMatchHistory(playerId, startIndex = 0, endIndex = 10) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/match-history/v1/history/${playerId}?startIndex=${startIndex}&endIndex=${endIndex}`,{
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
            },
        });
    }

    getPlayerCompetitiveHistory(playerId, startIndex = 0, endIndex = 10) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/mmr/v1/players/${playerId}/competitiveupdates?startIndex=${startIndex}&endIndex=${endIndex}`,{
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
            },
        });
    }

    getPlayerWallet(playerId) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/store/v1/wallet/${playerId}`,{
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
            },
        });
    }

    getPlayerStoreFront(playerId) {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + `/store/v2/storefront/${playerId}`,{
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
            },
        });
    }

    getPlayers(playerIds) {
        return axios.put(this.getPlayerDataServiceUrl(this.region) + '/name-service/v2/players', playerIds,{
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
            },
        });
    }

    getSession(playerId) {
        return axios.get(this.getPartyServiceUrl(this.region) + `/session/v1/sessions/${playerId}`,{
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
            },
        });
    }

    getStoryContractDefinitions() {
        return axios.get(this.getPlayerDataServiceUrl(this.region) + '/contract-definitions/v2/definitions/story',{
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
            },
        });
    }

}

module.exports = API;
