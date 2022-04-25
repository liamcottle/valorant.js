# Content API

_This is an API wrapper for the_ [_valorant-api.com_](https://valorant-api.com) _API_

#### Getting Started:

First you need to import the Content module and the Language Module. This is how it works:

```javascript
const { Content, Languages } = require("@liamcottle/valorant.js");
```

Next, you need to create an Content instance. Here you have the possibility to choose the Language in which the data will be delivered. By deafult the language is set to English. Here is a list of all available languages:

|    **Languages**    |
| :-----------------: |
|       German        |
|       English       |
|    Spanish_Spain    |
|   Spanish_Mexico    |
|       French        |
|     Indonesian      |
|       Italien       |
|      Japanese       |
|       Korean        |
|       Polish        |
|  Portuguese_Brazil  |
|       Russian       |
|        Thai         |
|       Turkish       |
|     Vietnamese      |
| Chinese_Simplified  |
| Chinese_Traditional |

```js
const content = new ContentAPI(languages.English);
```

After you have created the ContentAPI instance you can start fetching data. For this you can either use _async/await_ or _.then_ this works as follows:
**Async/Await:**

```js
//Send a request to get all agents
const data = await content.getAgents();
//Log the received data in the console
console.log(data);
```

**.then**

```js
content.getAgents().then((data) => {
  //log data
  console.log(data);
});
```

Here is a example on how to get the Daily Store of a Player and then get the Asset Data using the ContentAPI and the [ClientAPI](https://github.com/liamcottle/valorant.js#readme) this Package provides.

```js
//import modules
const { API, Content, languages, Regions } = require("@liamcottle/valorant.js");

//initiate the API and the Content Module
const client = new API(Regions.EU);
const content = new Content(languages.English);

//authorize using the ClientAPI
client.authorize("username", "password").then(() => {
  client.getPlayerStoreFront(client.user_id).then(async (response) => {
    //get assets for the first Skin in the Store
    const item1 = await content.getWeaponSkinLevelbyUuid(
      response.data.SkinsPanelLayout.SingleItemOffers[0]
    );
  });
  //log item
  console.log(item1);
});
```

Here is a list of all available Endpoints for the ContentAPI:

- **[Agents](https://dash.valorant-api.com/endpoints/agents)**
  - getAgents()
  - getAgentsbyUuid(_uuid_)
- **[Buddies](https://dash.valorant-api.com/endpoints/buddies)**
  - getBuddies()
  - getBuddyLevels()
  - getBuddybyUuid(_uuid_)
  - getBuddyLevelbyUuid(_uuid_)
- **[Bundles](https://dash.valorant-api.com/endpoints/bundles)**
  - getBundles()
  - getBundlebyUuid(_uuid_)
- **[Ceremonies](https://dash.valorant-api.com/endpoints/ceremonies)**
  - getCeremonies()
  - getCeremonybyUuid(_uuid_)
- **[Competitive Tiers](https://dash.valorant-api.com/endpoints/competitivetiers)**
  - getCompetitiveTiers()
  - getCompetitiveTierbyUuid(_uuid_)
- **[Content Tiers](https://dash.valorant-api.com/endpoints/contenttiers)**
  - getContentTiers()
  - getContentTierbyUuid(_uuid_)
- **[Contracts](https://dash.valorant-api.com/endpoints/contracts)**
  - getContracts()
  - getContractbyUuid(_uuid_)
- **[Currencies](https://dash.valorant-api.com/endpoints/currencies)**
  - getCurrencies()
  - getCurrencybyUuid(_uuid_)
- **[Events](https://dash.valorant-api.com/endpoints/events)**
  - getEvents()
  - getEventbyUuid(_uuid_)
- **[Gamemodes](https://dash.valorant-api.com/endpoints/gamemodes)**
  - getGamemodes()
  - getGamemodeEquippables()
  - getGamemodebyUuid(_uuid_)
  - getGamemodeEquippablebyUuid(_uuid_)
- **[Gear](https://dash.valorant-api.com/endpoints/gear)**
  - getGear()
  - getGearbyUuid(_uuid_)
- **[Maps](https://dash.valorant-api.com/endpoints/maps)**
  - getMaps()
  - getMapbyUuid(_uuid_)
- **[Player Cards](https://dash.valorant-api.com/endpoints/playercards)**
  - getPlayerCards()
  - getPlayerCardbyUuid(_uuid_)
- **[Player Titles](https://dash.valorant-api.com/endpoints/playertitles)**
  - getPlayerTitles()
  - getPlayerTitlebyUuid(_uuid_)
- **[Seasons](https://dash.valorant-api.com/endpoints/seasons)**
  - getSeasons()
  - getCompetitiveSeasons()
  - getSeasonbyUuid(_uuid_)
  - getCompetitiveSeasonbyUuid(_uuid_)
- **[Sprays](https://dash.valorant-api.com/endpoints/sprays)**
  - getSprays()
  - getSpraybyUuid(_uuid_)
- **[Themes](https://dash.valorant-api.com/endpoints/themes)**
  - getThemes()
  - getThemebyUuid(_uuid_)
- **[Weapons](https://dash.valorant-api.com/endpoints/weapons)**
  - getWeapons()
  - getWeaponSkins()
  - getWeaponSkinChromas()
  - get WeaponSkinLevels()
  - getWeaponbyUuid(_uuid_)
  - getWeaponSkinbyUuid(_uuid_)
  - getWeaponSkinChromabyUuid(_uuid_)
  - getWeaponSkinLevelbyUuid(_uuid_)

_If you have any Issue or Suggestion please open an Issue on the [Github Repository](https://github.com/liamcottle/valorant.js) or join the [Discord Server](https://discord.gg/HUFEkChRpP)_
