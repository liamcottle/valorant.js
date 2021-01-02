# VALORANT.js

This is an unofficial NodeJS library for interacting with the [VALORANT](https://playvalorant.com/) APIs used in game.

## Install

To use this library in your own NodeJS app, you can install it via `npm`.

```
npm install @liamcottle/valorant.js
```

## Usage

First, Create a new `Valorant.API` instance with the region associated with your player data.

```js
const Valorant = require('@liamcottle/valorant.js');
const valorantApi = new Valorant.API(Valorant.Regions.AsiaPacific);
```

> If your region is not available in the `Valorant.Regions` class, but you know your region code, you can pass it in directly:
> ```
> const valorantApi = new Valorant.API('NA');
> ```

Once you have a `Valorant.API` instance, you need to obtain an `access_token` and `entitlements_token` which are used for authorization when making requests to the Valorant APIs.

```js
valorantApi.authorize('username', 'password').then(() => {
    // auth was successful, go make some requests!
}).catch((error) => {
    console.log(error);
});
````

> Note that the `access_token` and `entitlements_token` do expire after some time. So you will need to authorize again once they expire.

Alternatively, if you already have your `access_token` and `entitlements_token` you can set them like so:

```js
// use saved authorization details
valorantApi.username = 'username';
valorantApi.user_id = 'uuid',
valorantApi.access_token = 'eyJ...';
valorantApi.entitlements_token = 'eyJ...';
```

## Example

```js
const Valorant = require('@liamcottle/valorant.js');
const valorantApi = new Valorant.API(Valorant.Regions.AsiaPacific);

// auth with valorant apis
valorantApi.authorize('username', 'password').then(() => {

    // log auth data
    console.log({
        username: valorantApi.username,
        user_id: valorantApi.user_id,
        access_token: valorantApi.access_token,
        entitlements_token: valorantApi.entitlements_token,
    });

    // log wallet balances
    valorantApi.getPlayerWallet(valorantApi.user_id).then((response) => {
        console.log(response.data);
    });

    // log competitive history
    valorantApi.getPlayerCompetitiveHistory(valorantApi.user_id).then((response) => {
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