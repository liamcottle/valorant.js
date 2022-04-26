"use strict";

const axios = require("axios").default;
const languages = require("./languages");

class ContentAPI {
  /**
   * Initialize the Content API using https://valorant-api.com/
   * @param {string} language The language you want the content to be returned in
   */
  constructor(language = languages.English) {
    this.language = language;
    this.baseURL = "https://valorant-api.com/v1/";
  }

  // agent Endpoints

  /**
   * Get a list of all Agents
   * @returns {Promise<Array<Agent>>} A list of all Agents
   */
  async getAgents() {
    const data = await axios.get(`${this.baseURL}agents`, {
      params: { language: this.language, isPlayableCharacter: true },
    });
    return data.data.data;
  }

  /**
   * Get a specific Agent by UUID
   * @param {string} uuid The UUID of the Agent
   * @returns {Promise<Agent>} Agent Object
   */
  async getAgentByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}agents/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  // Buddies Endpoints

  /**
   * Get a list of all Buddies
   * @returns {Promise<Array<Buddy>>} A list of all Buddies
   */
  async getBuddies() {
    const data = await axios.get(`${this.baseURL}buddies`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of all weapon buddy levels
   * @returns {Promise<Array<Buddy>>} A list of all Buddy Levels
   */
  async getBuddyLevels() {
    const data = await axios.get(`${this.baseURL}buddies/levels`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of the requested weapon buddy
   * @param {string} uuid The UUID of the Buddy
   * @returns {Promise<Buddy>} Buddy Object
   */
  async getBuddyByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}buddies/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of the requested weapon buddy level
   * @param {string} uuid Buddy UUID
   * @returns {Promise<BuddyLevel>} BuddyLevel Object
   */
  async getBuddyLevelByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}buddies/levels/${uuid}`, {
      params: { language: this.language },
    });
  }

  // Bundle Endpoints

  /**
   * Returns a list of all Bundles
   * @returns {Promise<Array<Bundle>>} A list of all Bundles
   */
  async getBundles() {
    const data = await axios.get(`${this.baseURL}bundles`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of the requested bundle
   * @param {string} uuid Bundle UUID
   * @returns {Promise<Bundle>} Bundle Object
   */
  async getBundleByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}bundles/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  // Ceremony Endpoints

  /**
   * Returns data and assets of all ceremonies
   * @returns {Promise<Array<Ceremony>>} A list of all Ceremonies
   */
  async getCeremonies() {
    const data = await axios.get(`${this.baseURL}ceremonies`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of the requested ceremony
   * @param {string} uuid Ceremony UUID
   * @returns {Promise<Ceremony>} Ceremony Object
   */
  async getCeremonyByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}ceremonies/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  // Competitive Tiers Endpoints

  /**
   * Returns data and assets of all competitive tiers
   * @returns {Promise<Array<CompetitiveTier>>} A list of all Competitive Tiers
   */
  async getCompetitiveTiers() {
    const data = await axios.get(`${this.baseURL}competitivetiers`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets the requested competitive tier table
   * @param {string} uuid Competitive Tier UUID
   * @returns {Promise<CompetitiveTier>} CompetitiveTier Object
   */
  async getCompetitiveTierByUuid(uuid) {
    const data = axios.get(`${this.baseURL}competitivetiers/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  // Content Tiers Endpoints

  /**
   * Returns data and assets of all content tiers
   * @returns {Promise<Array<ContentTier>>} A list of all Content Tiers
   */
  async getContentTiers() {
    const data = await axios.get(`${this.baseURL}contenttiers`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets for the requested content tier
   * @param {string} uuid Content Tier UUID
   * @returns {Promise<ContentTier>} ContentTier Object
   */
  async getContentTierByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}contenttiers/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  // Contract Endpoints

  /**
   * Returns data and assets of all contracts
   * @returns {Promise<Array<Contract>>} A list of all Contracts
   */
  async getContracts() {
    const data = await axios.get(`${this.baseURL}contracts`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets the requested contract
   * @param {string} uuid Contract UUID
   * @returns {Promise<Contract>} Contract Object
   */
  async getContractByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}contracts/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  // Currencies Endpoints

  /**
   * Returns data and assets of all in-game currencies
   * @returns {Promise<Array<Currency>>} A list of all Currencies
   */
  async getCurrencies() {
    const data = await axios.get(`${this.baseURL}currencies`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets the requested in-game currency
   * @param {string} uuid Currency UUID
   * @returns {Promise<Currency>} Currency Object
   */
  async getCurrencyByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}currencies/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  // Events Endpoints
  /**
   * Returns data and assets of all events
   * @returns {Promise<Array<Event>>} A list of all Events
   */
  async getEvents() {
    const data = await axios.get(`${this.baseURL}events`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets the requested event
   * @param {string} uuid Event UUID
   * @returns {Promise<Event>} Event Object
   */
  async getEventByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}events/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  // Gamemode Endpoints

  /**
   * Returns data and assets of all gamemodes
   * @returns {Promise<Array<Gamemode>>} A list of all Gamemodes
   */
  async getGameModes() {
    const data = await axios.get(`${this.baseURL}gamemodes`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of all gamemode equippables
   * @returns {Promise<Array<Gamemode>>} A list of all Gamemode Equippables
   */
  async getGamemodeEquippables() {
    const data = await axios.get(`${this.baseURL}gamemodes/equippables`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of the requested gamemode
   * @param {string} uuid
   * @returns {Promise<Gamemode>} Gamemode Object
   */
  async getGameModeByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}gamemodes/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of the requested gamemode equippable
   * @param {string} uuid Gamemode Equippable UUID
   * @returns {Promise<GamemodeEquippable>} Gamemode Equippable Object
   */
  async getGamemodeEquippableByUuid(uuid) {
    const data = await axios.get(
      `${this.baseURL}gamemodes/equippables/${uuid}`,
      {
        params: { language: this.language },
      }
    );
    return data.data.data;
  }

  // Gear Endpoints

  /**
   * Returns data and assets of all gear
   * @returns {Promise<Array<Gear>>} A list of all Gear
   */
  async getGear() {
    const data = await axios.get(`${this.baseURL}gear`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of the requested gear
   * @param {string} uuid Gear UUID
   * @returns {Promise<Gear>} Gear Object
   */
  async getGearByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}gear/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  // Map Endpoints

  /**
   * Returns data and assets of all maps
   * @returns {Promise<Array<Map>>} A list of all Maps
   */
  async getMaps() {
    const data = await axios.get(`${this.baseURL}maps`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of the requested map
   * @param {string} uuid Map UUID
   * @returns {Promise<Map>} Map Object
   */
  async getMapByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}maps/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  // Player Cards Endpoints

  /**
   * Returns data and assets of all player cards
   * @returns {Promise<Array<PlayerCard>>} A list of all Player Cards
   */
  async getPlayerCards() {
    const data = await axios.get(`${this.baseURL}playercards`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of the requested player card
   * @param {string} uuid Player Card UUID
   * @returns {Promise<PlayerCard>} Player Card Object
   */
  async getPlayerCardByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}playercards/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  // Player Titles Endpoints

  /**
   * Returns data and assets of all player titles
   * @returns {Promise<Array<PlayerTitle>>} A list of all Player Titles
   */
  async getPlayerTitles() {
    const data = await axios.get(`${this.baseURL}playertitles`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of the requested player title
   * @param {string} uuid Player Title UUID
   * @returns {Promise<PlayerTitle>} Player Title Object
   */
  async getPlayerTitleByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}playertitles/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  // Seasons Endpoints

  /**
   * Returns data and assets of all seasons
   * @returns {Promise<Array<Season>>} A list of all Seasons
   */
  async getSeasons() {
    const data = await axios.get(`${this.baseURL}seasons`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data of all competitive seasons
   * @returns {Promise<Array<CompetitiveSeason>>} A list of all Competitive Seasons
   */
  async getCompetitiveSeasons() {
    const data = await axios.get(`${this.baseURL}seasons/competitive`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data of the requested season
   * @param {string} uuid Season UUID
   * @returns {Promise<Season>} Season Object
   */
  async getSeasonByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}seasons/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data of the requested competitive season
   * @param {string} uuid Competitive Season UUID
   * @returns {Promise<CompetitiveSeason>} Competitive Season Object
   */
  async getCompetitiveSeasonByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}seasons/competitive/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  // Spray Endpoints

  /**
   * Returns data and assets of all sprays
   * @returns {Promise<Array<Season>>} A list of all Seasons
   */
  async getSprays() {
    const data = await axios.get(`${this.baseURL}sprays`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of all spray levels
   * @returns {Promise<Array<Spray>>} A list of all Sprays
   */
  async getSprayLevels() {
    const data = await axios.get(`${this.baseURL}sprays/levels`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of the requested spray
   * @param {string} uuid Spray UUID
   * @returns {Promise<Spray>} Spray Object
   */
  async getSprayByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}sprays/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of the requested spray level
   * @param {string} uuid Spray Level UUID
   * @returns {Promise<SprayLevel>} Spray Level Object
   */
  async getSprayLevelByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}sprays/levels/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  // Theme Endpoints

  /**
   * Returns data and assets of all themes
   * @returns {Promise<Array<Theme>>} A list of all Themes
   */
  async getThemes() {
    const data = await axios.get(`${this.baseURL}themes`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of the requested theme
   * @param {string} uuid Theme UUID
   * @returns {Promise<Theme>} Theme Object
   */
  async getThemeByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}themes/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  // Weapon Endpoints

  /**
   * Returns data and assets of all weapons
   * @returns {Promise<Array<Weapon>>} A list of all Weapons
   */
  async getWeapons() {
    const data = await axios.get(`${this.baseURL}weapons`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of all weapon skins
   * @returns {Promise<Array<WeaponSkins>>} A list of all Weapons
   */
  async getWeaponsSkins() {
    const data = await axios.get(`${this.baseURL}weapons/skins`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of all weapon skin chromas
   * @returns {Promise<Array<WeaponSkinChromas>>} A list of all Weapon Skins Chromas
   */
  async getWeaponSkinChromas() {
    const data = await axios.get(`${this.baseURL}weapons/skinchromas`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of all weapon skin levels
   * @returns {Promise<Array<WeaponSkinLevels>>} A list of all Weapon Skin Levels
   */
  async getWeaponSkinLevels() {
    const data = await axios.get(`${this.baseURL}weapons/skinlevels`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of the requeted weapon
   * @param {string} uuid Weapon UUID
   * @returns {Promise<Weapon>} Weapon Object
   */
  async getWeaponByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}weapons/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of the requested weapon skin
   * @param {string} uuid Weapon Skin UUID
   * @returns {Promise<WeaponSkin>} Weapon Skin Object
   */
  async getWeaponSkinByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}weapons/skins/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of the requeted weapon skin chroma
   * @param {string} uuid Weapon Skin Chroma UUID
   * @returns {Promise<WeaponSkinChroma>} Weapon Skin Chroma Object
   */
  async getWeaponSkinChromaByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}weapons/skinchromas/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }

  /**
   * Returns data and assets of the requeted weapon skin level
   * @param {string} uuid Weapon Skin Level UUID
   * @returns {Promise<WeaponSkinLevel>} Weapon Skin Level Object
   */
  async getWeaponSkinLevelByUuid(uuid) {
    const data = await axios.get(`${this.baseURL}weapons/skinlevels/${uuid}`, {
      params: { language: this.language },
    });
    return data.data.data;
  }
}

module.exports = ContentAPI;
