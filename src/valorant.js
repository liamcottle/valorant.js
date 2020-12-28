"use strict";

const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const querystring = require('querystring');
const tough = require('tough-cookie');
const url = require('url');

const regions = require('./regions');

axiosCookieJarSupport(axios);

class Valorant {

    constructor(region = regions.AsiaPacific) {
        this.region = region;
        this.username = null;
        this.access_token = null;
        this.entitlements_token = null;
        this.client_version = 'release-01.14-shipping-32-502227';
    }

    getPlayerDataDomain(region) {
        return `https://pd.${region}.a.pvp.net`;
    }

    getSharedDataDomain(region) {
        return `https://shared.${region}.a.pvp.net`;
    }

    authorize(username, password) {

        const cookieJar = new tough.CookieJar();

        return axios.post('https://auth.riotgames.com/api/v1/authorization', {
            'client_id': 'play-valorant-web-prod',
            'nonce': '1',
            'redirect_uri': 'https://beta.playvalorant.com/opt_in',
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
        });
    }

    getContent() {
        return axios.get(this.getSharedDataDomain(this.region) + '/content-service/v2/content', {
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
                'X-Riot-ClientVersion': this.client_version,
            },
        });
    }

    getPlayers(ids) {
        return axios.put(this.getPlayerDataDomain(this.region) + '/name-service/v2/players', ids,{
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'X-Riot-Entitlements-JWT': this.entitlements_token,
            },
        });
    }

}

module.exports = Valorant;
