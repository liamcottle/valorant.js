<p align="center">
    <img src="./valorant.js.svg" width="400"></a>
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@liamcottle/valorant.js"><img src="https://img.shields.io/npm/dt/@liamcottle/valorant.js" alt="npm"/></a>
<a href="https://discord.gg/APQSQZNV7t"><img src="https://img.shields.io/badge/Discord-Liam%20Cottle's%20Discord-%237289DA?style=flat&logo=discord" alt="discord"/></a>
<a href="https://twitter.com/liamcottle"><img src="https://img.shields.io/badge/Twitter-@liamcottle-%231DA1F2?style=flat&logo=twitter" alt="twitter"/></a>
<br/>
<a href="https://ko-fi.com/liamcottle"><img src="https://img.shields.io/badge/Donate%20a%20Coffee-liamcottle-yellow?style=flat&logo=buy-me-a-coffee" alt="donate on ko-fi"/></a>
<a href="./donate.md"><img src="https://img.shields.io/badge/Donate%20Bitcoin-3FPBfiEwioWHFix3kZqe5bdU9F5o8mG8dh-%23FF9900?style=flat&logo=bitcoin" alt="donate bitcoin"/></a>
</p>

This is an **unofficial** NodeJS library for interacting with the [VALORANT](https://playvalorant.com/) APIs used in game. It also serves as a wrapper around third party APIs that provide game content such as maps, player cards and weapons.

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

## View Competitive Rank and Elo

If you're interested in getting information about your current rank and how long until you rank up, you could do something like this:

```js
const Valorant = require('@liamcottle/valorant.js');
const valorantApi = new Valorant.API(Valorant.Regions.AsiaPacific);

function calculateElo(tier, progress) {
    if(tier >= 24) {
        return 2100 + progress
    } else {
        return ((tier * 100) - 300) + progress;
    }
}

// auth with valorant apis
valorantApi.authorize('username', 'password').then(() => {

    // get player mmr
    valorantApi.getPlayerMMR(valorantApi.user_id).then((response) => {

        if(response.data.LatestCompetitiveUpdate){
            const update = response.data.LatestCompetitiveUpdate;
            var elo = calculateElo(update.TierAfterUpdate, update.RankedRatingAfterUpdate);
            console.log(`Movement: ${update.CompetitiveMovement}`);
            console.log(`Current Tier: ${update.TierAfterUpdate} (${Valorant.Tiers[update.TierAfterUpdate]})`);
            console.log(`Current Tier Progress: ${update.RankedRatingAfterUpdate}/100`);
            console.log(`Total Elo: ${elo}`);
        } else {
            console.log("No competitive update available. Have you played a competitive match yet?");
        }

    });

}).catch((error) => {
    console.log(error);
});
```

Which will output something like these:

```
Movement: DEMOTED
Current Tier: 11 (Silver 3)
Current Tier Progress: 72/100
Total ELO: 872
```

```
Movement: MAJOR_INCREASE
Current Tier: 12 (Gold 1)
Current Tier Progress: 42/100
Total Elo: 942
```

## View Competitive Leaderboard

If you're interested in getting the current competitive leaderboards shown in game, you can request them like so:

```js
const Valorant = require('@liamcottle/valorant.js');
const valorantApi = new Valorant.API(Valorant.Regions.AsiaPacific);

// auth with valorant apis
valorantApi.authorize('username', 'password').then(() => {
    
    // episode 2, act 1
    var seasonId = '97b6e739-44cc-ffa7-49ad-398ba502ceb0';
    
    // get competitive leaderboard
    valorantApi.getCompetitiveLeaderboard(seasonId).then((response) => {
        console.log(response.data);
    });

}).catch((error) => {
    console.log(error);
});
```

Which will output something like this: (I have blanked out the player IDs)

```
{
  Deployment: 'ap-glz-ap-1',
  QueueID: 'competitive',
  SeasonID: '97b6e739-44cc-ffa7-49ad-398ba502ceb0',
  Players: [
    {
      Subject: '00000000-0000-0000-0000-000000000000',
      GameName: 'username1',
      TagLine: 'tag1',
      LeaderboardRank: 1,
      RankedRating: 123,
      NumberOfWins: 123,
      PlayerCardID: '00000000-0000-0000-0000-000000000000',
      TitleID: '00000000-0000-0000-0000-000000000000',
      IsBanned: false,
      IsAnonymized: false
    },
    {
      Subject: '00000000-0000-0000-0000-000000000000',
      GameName: 'username2',
      TagLine: 'tag2',
      LeaderboardRank: 2,
      RankedRating: 123,
      NumberOfWins: 123,
      PlayerCardID: '00000000-0000-0000-0000-000000000000',
      TitleID: '00000000-0000-0000-0000-000000000000',
      IsBanned: false,
      IsAnonymized: false
    },
  ]
}
```

## Implemented API Calls

Below is a list of API calls that are implemented in this library.

- [x] `authorize(username, password)`
- [x] `getConfig(region)`
- [x] `getContent()`
- [x] `getCompetitiveLeaderboard(seasonId)`
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

## Content API

Check out the [Content API Docs](./docs/ContentAPI.md) if you're wanting to fetch game assets such as Maps, Player Cards and Weapons.

## Local Riot Client API

If you're looking for information on how to interact with `RiotClientServices.exe`, such as intercepting requests, take a look at the documentation in [RiotClientServices.md](./docs/RiotClientServices.md)

A wrapper class exists in this repo, and can be used like so:

```
// init from your local lock file
const localRiotClientApi = Valorant.LocalRiotClientAPI.initFromLockFile();

// or, init with known credentials and port
const localRiotClientApi = new Valorant.LocalRiotClientAPI('127.0.0.1', 'port', 'riot', 'yourtoken');`
```

## Support

- If you need any help, feel free to [Join the Discord](https://discord.gg/APQSQZNV7t).
- If you find a bug, feel free to open an issue or submit a pull request.

In some cases, you might receive an `HTTP 404` error when using some in-game APIs. It's likely that the `client_version` we are using is outdated.

You can find the latest `client_version` [here](https://valorant-api.com/v1/version) listed as `riotClientVersion` and you can manually set the `client_version` used in this library like so:

```
const Valorant = require('@liamcottle/valorant.js');
const valorantApi = new Valorant.API(Valorant.Regions.AsiaPacific);
valorantApi.client_version = "...";
```

## License

MIT

## Legal

Riot Games, VALORANT, and any associated logos are trademarks, service marks, and/or registered trademarks of Riot Games, Inc.

This project is in no way affiliated with, authorized, maintained, sponsored or endorsed by Riot Games, Inc or any of its affiliates or subsidiaries.

I, the project owner and creator, am not responsible for any legalities that may arise in the use of this project. Use at your own risk.
