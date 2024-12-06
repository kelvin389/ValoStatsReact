// generated using quicktype then manually edited for accuracy and readability
// https://app.quicktype.io/?l=ts
// *probably largely inaccurate for fields that are not necessary for this app*

export interface Match {
  metadata: Metadata;
  players: Player[];
  observers: any[];
  coaches: any[];
  teams: TeamData[];
  rounds: Round[];
  kills: Kill[];
}

export interface Kill {
  time_in_round_in_ms: number;
  time_in_match_in_ms: number;
  round: number;
  killer: KillPlayer;
  victim: KillPlayer;
  assistants: KillPlayer[];
  location: Location;
  weapon: Weapon;
  secondary_fire_mode: boolean;
  player_locations: PlayerLocation[];
}

export interface KillPlayer {
  puuid: string;
  name: string;
  tag: string;
  team: TeamID;
}

export enum TeamID {
  Blue = "Blue",
  Red = "Red",
}

export interface Location {
  x: number;
  y: number;
}

export interface PlayerLocation {
  player: KillPlayer;
  view_radians: number;
  location: Location;
}

export interface Weapon {
  id: string;
  name: string | null;
  type: Type;
}

export enum Type {
  Ability = "Ability",
  Weapon = "Weapon",
}

export interface Metadata {
  match_id: string;
  map: Map;
  game_version: string;
  game_length_in_ms: number;
  started_at: Date;
  is_completed: boolean;
  queue: Queue;
  season: Season;
  platform: Platform;
  premier: null;
  party_rr_penaltys: PartyRrPenalty[];
  region: string;
  cluster: string;
}

export interface Map {
  id: string;
  name: string;
}

export interface Armor {
  id: string;
  name: string;
}

export interface Agent {
  id: string;
  name: string;
}

export interface PartyRrPenalty {
  party_id: string;
  penalty: number;
}

export enum Platform {
  PC = "pc",
  Console = "console", // completely guessed this
}

export interface Queue {
  id: string;
  name: string;
  mode_type: string;
}

export interface Season {
  id: string;
  short: string;
}

export interface Player {
  puuid: string;
  name: string;
  tag: string;
  team_id: TeamID;
  platform: Platform;
  party_id: string;
  agent: Agent;
  stats: PlayerStats;
  ability_casts: PlayerAbilityCasts;
  tier: Tier;
  customization: Customization;
  account_level: number;
  session_playtime_in_ms: number;
  behavior: Behavior;
  economy: PlayerEconomy;
}

export interface PlayerAbilityCasts {
  grenade: number;
  ability1: number;
  ability2: number;
  ultimate: number;
}

export interface Behavior {
  afk_rounds: number;
  friendly_fire: FriendlyFire;
  rounds_in_spawn: number;
}

export interface FriendlyFire {
  incoming: number;
  outgoing: number;
}

export interface Customization {
  card: string;
  title: string;
  preferred_level_border: null | string;
}

export interface PlayerEconomy {
  spent: LoadoutValue;
  loadout_value: LoadoutValue;
}

export interface LoadoutValue {
  overall: number;
  average: number;
}

export interface PlayerStats {
  score: number;
  kills: number;
  deaths: number;
  assists: number;
  headshots: number;
  bodyshots: number;
  legshots: number;
  damage: Damage;
}

export interface Damage {
  dealt: number;
  received: number;
}

export interface Tier {
  id: number;
  name: string;
}

export interface Round {
  id: number;
  result: Result;
  ceremony: string;
  winning_team: TeamID;
  plant: Defuse | null;
  defuse: Defuse | null;
  stats: RoundStats[];
}

export interface Defuse {
  round_time_in_ms: number;
  location: Location;
  player: KillPlayer;
  player_locations: PlayerLocation[];
  site?: Site;
}

export enum Site {
  A = "A",
  B = "B",
  C = "C",
}

export enum Result {
  Defuse = "Defuse",
  Elimination = "Elimination",
}

export interface RoundStats {
  player: KillPlayer;
  ability_casts: StatAbilityCasts;
  damage_events: DamageEvent[];
  stats: RoundPlayerStats;
  economy: StatEconomy;
  was_afk: boolean;
  received_penalty: boolean;
  stayed_in_spawn: boolean;
}

export interface StatAbilityCasts {
  grenade: null;
  ability_1: null;
  ability_2: null;
  ultimate: null;
}

export interface DamageEvent {
  player: KillPlayer;
  bodyshots: number;
  headshots: number;
  legshots: number;
  damage: number;
}

export interface StatEconomy {
  loadout_value: number;
  remaining: number;
  weapon: Weapon;
  armor: Armor | null;
}

export interface RoundPlayerStats {
  score: number;
  kills: number;
  headshots: number;
  bodyshots: number;
  legshots: number;
}

export interface TeamData {
  team_id: TeamID;
  rounds: Rounds;
  won: boolean;
  premier_roster: null;
}

export interface Rounds {
  won: number;
  lost: number;
}
