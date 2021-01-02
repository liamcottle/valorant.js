# VALORANT API NodeJS

This is an unofficial NodeJS library for interacting with the [VALORANT](https://playvalorant.com/) APIs used in game.

## Install

To use this library in your own NodeJS app, you can install it via `npm`.

```
npm install liamcottle/valorant-api
```

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
