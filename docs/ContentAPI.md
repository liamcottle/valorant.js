# Content API

This is an API wrapper for [valorant-api.com](https://valorant-api.com). This API is separate from the in-game APIs and is managed by a third party.

#### Getting Started:

First you need to import the ContentAPI module and the Language Module.

```javascript
const { ContentAPI, Languages } = require("@liamcottle/valorant.js");
```

Next, you need to create a ContentAPI instance. You can optionally provide the Language the data should be returned in. By default, the language is set to English. Here is a list of all available languages:

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
const content = new ContentAPI(Languages.English);
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

Here is an example of how to get a players' Daily Store and then fetch the Asset Data using the ContentAPI.

```js
// import modules
const { API, ContentAPI, Languages, Regions } = require("@liamcottle/valorant.js");

// initiate the API and the ContentAPI Module
const client = new API(Regions.EU);
const content = new ContentAPI(Languages.English);

// authorize using the ClientAPI
client.authorize("username", "password").then(() => {
  client.getPlayerStoreFront(client.user_id).then(async (response) => {

    // get assets for the first Skin in the Store
    const item1 = await content.getWeaponSkinLevelByUuid(
        response.data.SkinsPanelLayout.SingleItemOffers[0]
    );

    // log item
    console.log(item1);

  });
});
```

Here is a list of all available Endpoints for the ContentAPI:

- **[Agents](https://dash.valorant-api.com/endpoints/agents)**
  - getAgents()
  - getAgentsByUuid(_uuid_)
- **[Buddies](https://dash.valorant-api.com/endpoints/buddies)**
  - getBuddies()
  - getBuddyLevels()
  - getBuddyByUuid(_uuid_)
  - getBuddyLevelByUuid(_uuid_)
- **[Bundles](https://dash.valorant-api.com/endpoints/bundles)**
  - getBundles()
  - getBundleByUuid(_uuid_)
- **[Ceremonies](https://dash.valorant-api.com/endpoints/ceremonies)**
  - getCeremonies()
  - getCeremonyByUuid(_uuid_)
- **[Competitive Tiers](https://dash.valorant-api.com/endpoints/competitivetiers)**
  - getCompetitiveTiers()
  - getCompetitiveTierByUuid(_uuid_)
- **[ContentAPI Tiers](https://dash.valorant-api.com/endpoints/contenttiers)**
  - getContentTiers()
  - getContentTierByUuid(_uuid_)
- **[Contracts](https://dash.valorant-api.com/endpoints/contracts)**
  - getContracts()
  - getContractByUuid(_uuid_)
- **[Currencies](https://dash.valorant-api.com/endpoints/currencies)**
  - getCurrencies()
  - getCurrencyByUuid(_uuid_)
- **[Events](https://dash.valorant-api.com/endpoints/events)**
  - getEvents()
  - getEventByUuid(_uuid_)
- **[Gamemodes](https://dash.valorant-api.com/endpoints/gamemodes)**
  - getGamemodes()
  - getGamemodeEquippables()
  - getGamemodeByUuid(_uuid_)
  - getGamemodeEquippableByUuid(_uuid_)
- **[Gear](https://dash.valorant-api.com/endpoints/gear)**
  - getGear()
  - getGearByUuid(_uuid_)
- **[Maps](https://dash.valorant-api.com/endpoints/maps)**
  - getMaps()
  - getMapByUuid(_uuid_)
- **[Player Cards](https://dash.valorant-api.com/endpoints/playercards)**
  - getPlayerCards()
  - getPlayerCardByUuid(_uuid_)
- **[Player Titles](https://dash.valorant-api.com/endpoints/playertitles)**
  - getPlayerTitles()
  - getPlayerTitleByUuid(_uuid_)
- **[Seasons](https://dash.valorant-api.com/endpoints/seasons)**
  - getSeasons()
  - getCompetitiveSeasons()
  - getSeasonByUuid(_uuid_)
  - getCompetitiveSeasonByUuid(_uuid_)
- **[Sprays](https://dash.valorant-api.com/endpoints/sprays)**
  - getSprays()
  - getSprayByUuid(_uuid_)
- **[Themes](https://dash.valorant-api.com/endpoints/themes)**
  - getThemes()
  - getThemeByUuid(_uuid_)
- **[Weapons](https://dash.valorant-api.com/endpoints/weapons)**
  - getWeapons()
  - getWeaponSkins()
  - getWeaponSkinChromas()
  - get WeaponSkinLevels()
  - getWeaponByUuid(_uuid_)
  - getWeaponSkinByUuid(_uuid_)
  - getWeaponSkinChromaByUuid(_uuid_)
  - getWeaponSkinLevelByUuid(_uuid_)

_If you have any Issue or Suggestion please open an Issue on the [Github Repository](https://github.com/liamcottle/valorant.js) or join the [Discord Server](https://discord.gg/HUFEkChRpP)_
