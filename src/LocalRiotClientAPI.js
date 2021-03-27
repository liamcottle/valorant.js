"use strict";

const axios = require('axios').default;
const fs = require("fs");
const https = require("https");
const { spawn } = require('child_process');

/**
 * This class can be used to interact with the RiotClientServices.exe HTTP API that runs locally
 * when VALORANT is running. If VALORANT is not running, the HTTP API will not be running.
 *
 * Here's a few ways of using this class:
 * `const localRiotClientApi = Valorant.LocalRiotClientAPI.initFromLockFile();`
 * `const localRiotClientApi = Valorant.LocalRiotClientAPI.launch(null, '12345', '0.0.0.0', 'valorant', 'live');`
 * `const localRiotClientApi = new Valorant.LocalRiotClientAPI('127.0.0.1', 'port', 'riot', 'yourtoken');`
 *
 * Some endpoints take a few seconds or so before they are available after logging in. You will generally receive an
 * HTTP 503 error if they are not ready yet. Just wait a few seconds and try again.
 */
class LocalRiotClientAPI {

    /**
     * @param ip IP Address where RiotClientServices.exe is running.
     * @param port Port that RiotClientServices.exe is listening on.
     * @param username Username to access local server. Usually set to 'riot'.
     * @param password The password from the lockfile.
     */
    constructor(ip, port, username, password) {

        this.ip = ip;
        this.port = port;
        this.username = username;
        this.password = password;

        // create authorization header
        this.authorization = Buffer.from(`${this.username}:${this.password}`, 'utf8').toString('base64');

        // init axios http client
        this.axios = axios.create({
            baseURL: `https://${this.ip}:${this.port}`,
            headers: {
                'Authorization': `Basic ${this.authorization}`,
                'rchat-blocking': 'true'
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false, // disable ssl verification for self signed cert used by RiotClientServices.exe
            }),
        });

    }

    /**
     * Launch RiotClientServices.exe as a child process
     * @param path the absolute path to RiotClientServices.exe
     * @param appPort The port to run the webserver on
     * @param appListenAddress The address to bind the webserver to. Set to 0.0.0.0 to access from other devices on your network
     * @param launchProduct The game to launch after successful login: 'valorant' or 'league_of_legends'
     * @param launchPatchline The patchline, usually 'live'
     */
    static launch(path = null, appPort = '12345', appListenAddress = '127.0.0.1', launchProduct = 'test', launchPatchline = 'test') {

        /**
         * if no path is provided, assume where it is
         * C:\Riot Games\Riot Client\RiotClientServices.exe
         */
        if(!path){
            path = `C:\\Riot Games\\Riot Client\\RiotClientServices.exe`;
        }

        // launch RiotClientServices.exe with provided flags
        return spawn(path, [
            // setting to an invalid value, like 'test' will prevent any game from launching after successful login
            `--launch-product=${launchProduct}`,
            `--launch-patchline=${launchPatchline}`,
            `--insecure`, // allows intercepting http requests
            `--app-port=${appPort}`,
            `--app-listen-address=${appListenAddress}`,
        ]);

    }

    /**
     * Read the RiotClientServices lockfile on the local machine and return a new LocalRiotClientAPI instance
     * @param path
     * @returns {LocalRiotClientAPI}
     */
    static initFromLockFile(path = null) {
        const lockFile = this.parseLockFile(path);
        return new LocalRiotClientAPI('127.0.0.1', lockFile.port, 'riot', lockFile.password);
    }

    /**
     * Read the local RiotClientServices lockfile, and return the data as an object
     * @param path The path to the lockfile
     */
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

    /**
     * Log in to RiotClientServices.exe with your Riot Credentials.
     * This also updates the UI and tries to launch the game passed in via --launch-product
     * @param username Riot Username
     * @param password Riot Password
     * @param persistLogin Stay logged in or not
     */
    login(username, password, persistLogin = false) {
        return this.axios.put('/rso-auth/v1/session/credentials', {
            'username': username,
            'password': password,
            'persistLogin': persistLogin,
        });
    }

    /**
     * Logs out the current session
     */
    logout() {
        return this.axios.delete('/rso-auth/v1/session');
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
    
    sendMessage(message, cid) {
        return this.axios.post('/chat/v5/messages', {
            'message': message,
            'cid': cid,
        });
    }
    
    removeFriend(puuid) {
        return this.axios.delete('/chat/v4/friends', {
            'puuid': puuid,
        });
    }

}

module.exports = LocalRiotClientAPI;
