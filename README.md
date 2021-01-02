# VALORANT API NodeJS

This is an unofficial NodeJS library for interacting with the [VALORANT](https://playvalorant.com/) APIs used in game.

## Install

To use this library in your own NodeJS app, you can install it via `npm`.

```
npm install @liamcottle/valorant-api
```

## Usage

Before using this library, you need to determine which region your player data belongs to. You can find the known regions in the [regions.js](./src/regions.js) file. Once you have determined your region, create a new `ValorantAPI` instance like so:

```js
const { ValorantAPI, ValorantRegions } = require('@liamcottle/valorant-api');
const valorant = new ValorantAPI(ValorantRegions.AsiaPacific);
```

> If your region is not listed, but you know your region code, you can pass it in directly:
> ```
> const valorant = new ValorantAPI('ap');
> ```

Once you have a `ValorantAPI` instance, the library needs to authenticate with the Riot APIs. This allows you to fetch player data. You can do so automatically by calling `authorize` with your username and password.

Your `username`, `access_token` and `entitlements_token` are cached in the `ValorantAPI` instance.

```js
valorant.authorize('username', 'password').then(() => {
    
    // you can print out your auth data like so
    console.log({
        username: valorant.username,
        access_token: valorant.access_token,
        entitlements_token: valorant.entitlements_token,
    });

    // authentication was successful, so you can now make requests to the valorant apis

}).catch((error) => {
    console.log(error);
});
````

> Note that the `access_token` and `entitlements_token` do expire after some time. So you will need to authorize again.

Alternatively, if you already have your `access_token` and `entitlements_token` you can set them like so:

```js
// use saved auth details
valorant.username = 'username';
valorant.access_token = 'eyJ...';
valorant.entitlements_token = 'eyJ...';
```

## Full Example

```js
const { ValorantAPI, ValorantRegions } = require('@liamcottle/valorant-api');
const valorant = new ValorantAPI(ValorantRegions.AsiaPacific);

// auth with valorant apis
valorant.authorize('username', 'password').then(() => {

    // log auth data
    console.log({
        username: valorant.username,
        user_id: valorant.user_id,
        access_token: valorant.access_token,
        entitlements_token: valorant.entitlements_token,
    });

    // log wallet balances
    valorant.getPlayerWallet(valorant.user_id).then((response) => {
        console.log(response.data);
    });

    // log competitive history
    valorant.getPlayerCompetitiveHistory(valorant.user_id).then((response) => {
        console.log(response.data);
    });

}).catch((error) => {
    console.log(error);
});
````

## Implemented API Calls

Below is a list of API calls that are implemented in this library.

- [x] `authorize(username, password)`
- [x] `getConfig(region)`
- [x] `getContent()`
- [x] `getMatch(matchId)`
- [x] `getParty(partyId)`
- [x] `getPartyByPlayer(playerId)`
- [x] `getPlayerLoadout(playerId)`
- [x] `getPlayerMMR(playerId)`
- [x] `getPlayerMatchHistory(playerId, startIndex, endIndex)`
- [x] `getPlayerCompetitiveHistory(playerId, startIndex, endIndex)`
- [x] `getPlayerWallet(playerId)`
- [x] `getPlayerStoreFront(playerId)`
- [x] `getPlayers(playerIds)`
- [x] `getStoryContractDefinitions()`

## License

MIT

## Legal

Riot Games, VALORANT, and any associated logos are trademarks, service marks, and/or registered trademarks of Riot Games, Inc.

This project is in no way affiliated with, authorized, maintained, sponsored or endorsed by Riot Games, Inc or any of its affiliates or subsidiaries.

I, the project owner and creator, am not responsible for any legalities that may arise in the use of this project. Use at your own risk.