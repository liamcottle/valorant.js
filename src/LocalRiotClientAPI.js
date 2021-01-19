"use strict";

const axios = require('axios').default;
const fs = require("fs");
const https = require("https");

/**
 * This class can be used to interact with the RiotClientServices.exe HTTP API that runs locally
 * when VALORANT is running. If VALORANT is not running, the HTTP API will not be running.
 *
 * NOTE: The HTTP API is only accessible from the PC where VALORANT is running, you can't make
 * requests to the HTTP API from other devices on the network. I even tried port forwarding the
 * local port to another port that was bound to 0.0.0.0, however the HTTP API just returns an HTTP 403
 * error for most requests, even when using the correct authorization header.
 *
 * Here's a few ways of using this class:
 * `const localRiotClientApi = Valorant.LocalRiotClientAPI.initFromLockFile();`
 * `const localRiotClientApi = new Valorant.LocalRiotClientAPI('riot', 'yourtoken', 'localport');`
 */
class LocalRiotClientAPI {

    constructor(username, password, port) {

        this.username = username;
        this.password = password;
        this.port = port;

        this.authorization = Buffer.from(`${this.username}:${this.password}`, 'utf8').toString('base64');

        this.axios = axios.create({
            baseURL: `https://127.0.0.1:${this.port}`,
            headers: {
                'Authorization': `Basic ${this.authorization}`,
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false, // disable ssl verification for self signed cert used by RiotClientServices.exe
            }),
        });

    }

    /**
     * Read the local RiotClient lockfile and return a new LocalRiotClientAPI instance
     * @param path
     * @returns {LocalRiotClientAPI}
     */
    static initFromLockFile(path = null) {
        const lockFile = this.parseLockFile(path);
        return new LocalRiotClientAPI('riot', lockFile.password, lockFile.port);
    }

    static parseLockFile(path = null) {

        /**
         * if no path is provided, try and find it:
         * C:\Users\username\AppData\Local\Riot Games\Riot Client\Config\lockfile
         */
        if(!path){
            const localAppDataPath = process.env.LOCALAPPDATA;
            path = `${localAppDataPath}\\Riot Games\\Riot Client\\Config\\lockfile`;
        }

        // read lockfile
        const lockfileContents = fs.readFileSync(path, 'utf8');

        /**
         * expected lockfile contents
         * name:pid:port:password:https
         */
        const matches = lockfileContents.match(/(.*):(.*):(.*):(.*):(.*)/);
        const name = matches[1];
        const pid = matches[2];
        const port = matches[3];
        const password = matches[4];
        const protocol = matches[5];

        return {
            'raw': lockfileContents,
            'name': name,
            'pid': pid,
            'port': port,
            'password': password,
            'protocol': protocol,
        };

    }

    getFriends() {
        return this.axios.get('/chat/v4/friends');
    }

    getFriendRequests() {
        return this.axios.get('/chat/v4/friendrequests');
    }

    addFriend(gameName, gameTag) {
        return this.axios.post('/chat/v4/friendrequests', {
            'game_name': gameName,
            'game_tag': gameTag,
        });
    }

    removeFriend(puuid) {
        return this.axios.delete('/chat/v4/friends', {
            'puuid': puuid,
        });
    }

}

module.exports = LocalRiotClientAPI;
