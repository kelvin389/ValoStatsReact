// generated using quicktype then manually edited for accuracy and readability
// https://app.quicktype.io/?l=ts

export interface Match {
  metadata: Metadata;
  players: Players;
  observers: any[];
  coaches: any[];
  teams: Teams;
  rounds: Round[];
  kills: Kill[];
}

export interface Kill {
  kill_time_in_round: number;
  kill_time_in_match: number;
  round?: number;
  killer_puuid: string;
  killer_display_name: string;
  killer_team: TeamName;
  victim_puuid: string;
  victim_display_name: string;
  victim_team: TeamName;
  victim_death_location: Location;
  damage_weapon_id: string;
  damage_weapon_name: DamageWeaponNameEnum | null;
  damage_weapon_assets: DamageWeaponAssetsClass;
  secondary_fire_mode: boolean;
  player_locations_on_kill: PlayerLocation[];
  assistants: Assistant[];
}

export interface Assistant {
  assistant_puuid: string;
  assistant_display_name: string;
  assistant_team: TeamName;
}

export enum TeamName {
  Blue = "Blue",
  Red = "Red",
}

export interface DamageWeaponAssetsClass {
  display_icon: null | string;
  killfeed_icon: null | string;
}

export enum DamageWeaponNameEnum {
  Ares = "Ares",
  Bucky = "Bucky",
  Bulldog = "Bulldog",
  Classic = "Classic",
  Ghost = "Ghost",
  Guardian = "Guardian",
  Marshal = "Marshal",
  Operator = "Operator",
  Outlaw = "Outlaw",
  Phantom = "Phantom",
  Sheriff = "Sheriff",
  Spectre = "Spectre",
  Stinger = "Stinger",
  Vandal = "Vandal",
  // TODO: COMPLETE LIST? or remove enum and just use strings
}

export interface PlayerLocation {
  player_puuid: string;
  player_display_name: string;
  player_team: TeamName;
  location: Location;
  view_radians: number;
}

export interface Location {
  x: number;
  y: number;
}

export interface Metadata {
  map: string;
  game_version: string;
  game_length: number;
  game_start: number;
  game_start_patched: string;
  rounds_played: number;
  mode: string;
  mode_id: string;
  queue: string;
  season_id: string;
  platform: PlatformEnum;
  matchid: string;
  premier_info: PremierInfo;
  region: string;
  cluster: string;
}

export enum PlatformEnum {
  Pc = "pc",
  //Console = "console"
}

export interface PremierInfo {
  tournament_id: null;
  matchup_id: null;
}

export interface Players {
  all_players: Player[];
  red: Player[];
  blue: Player[];
}

export interface Player {
  puuid: string;
  name: string;
  tag: string;
  team: TeamName;
  level: number;
  character: string;
  currenttier: number;
  currenttier_patched: string;
  player_card: string;
  player_title: string;
  party_id: string;
  session_playtime: SessionPlaytime;
  behavior: Behavior;
  platform: PlatformClass;
  ability_casts: AllPlayerAbilityCasts;
  assets: AllPlayerAssets;
  stats: Stats;
  economy: AllPlayerEconomy;
  damage_made: number;
  damage_received: number;
}

export interface AllPlayerAbilityCasts {
  x_cast: number;
  e_cast: number;
  q_cast: number;
  c_cast: number;
}

export interface AllPlayerAssets {
  card: Card;
  agent: Agent;
}

export interface Agent {
  small: string;
  bust: string;
  full: string;
  killfeed: string;
}

export interface Card {
  small: string;
  large: string;
  wide: string;
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

export interface AllPlayerEconomy {
  spent: LoadoutValue;
  loadout_value: LoadoutValue;
}

export interface LoadoutValue {
  overall: number;
  average: number;
}

export interface PlatformClass {
  type: PlatformEnum;
  os: OS;
}

export interface OS {
  name: string;
  version: string;
}

export interface SessionPlaytime {
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export interface Stats {
  score: number;
  kills: number;
  deaths: number;
  assists: number;
  bodyshots: number;
  headshots: number;
  legshots: number;
}

export interface Round {
  winning_team: TeamName;
  end_type: EndType;
  bomb_planted: boolean;
  bomb_defused: boolean;
  plant_events: PlantEvents;
  defuse_events: DefuseEvents;
  player_stats: RoundPlayerStats[];
}

export interface DefuseEvents {
  defuse_location: Location | null;
  defused_by: EdBy | null;
  defuse_time_in_round: number | null;
  player_locations_on_defuse: PlayerLocation[] | null;
}

export interface EdBy {
  puuid: string;
  display_name: string;
  team: TeamName;
}

export enum EndType {
  BombDefused = "Bomb defused",
  BombDetonated = "Bomb detonated",
  Eliminated = "Eliminated",
}

export interface PlantEvents {
  plant_location: Location | null;
  planted_by: EdBy | null;
  plant_site: PlantSite | null;
  plant_time_in_round: number | null;
  player_locations_on_plant: PlayerLocation[] | null;
}

export enum PlantSite {
  A = "A",
  B = "B",
  C = "C",
}

export interface RoundPlayerStats {
  ability_casts: RoundPlayerStatsAbilityCasts;
  player_puuid: string;
  player_display_name: string;
  player_team: TeamName;
  damage_events: DamageEvent[];
  damage: number;
  headshots: number;
  bodyshots: number;
  legshots: number;
  kill_events: Kill[];
  kills: number;
  score: number;
  economy: PlayerStatEconomy;
  was_afk: boolean;
  was_penalized: boolean;
  stayed_in_spawn: boolean;
}

export interface RoundPlayerStatsAbilityCasts {
  x_casts: null;
  e_casts: null;
  q_casts: null;
  c_casts: null;
}

export interface DamageEvent {
  receiver_puuid: string;
  receiver_display_name: string;
  receiver_team: TeamName;
  bodyshots: number;
  headshots: number;
  legshots: number;
  damage: number;
}

export interface PlayerStatEconomy {
  loadout_value: number;
  remaining: number;
  spent: number;
  weapon: Weapon;
  armor: Armor;
}

export interface Armor {
  id: null | string;
  name: ArmorName | null;
  assets: ArmorAssets;
}

export interface ArmorAssets {
  display_icon: null | string;
}

export enum ArmorName {
  HeavyShields = "Heavy Shields",
  LightShields = "Light Shields",
}

export interface Weapon {
  id: string;
  name: DamageWeaponNameEnum;
  assets: DamageWeaponAssetsClass;
}

export interface Teams {
  red: TeamData;
  blue: TeamData;
}

export interface TeamData {
  has_won: boolean;
  rounds_won: number;
  rounds_lost: number;
  roster: Roster | null;
}

export interface Roster {
  id: string;
  members: string[];
  name: string;
  tag: string;
  customization: Customization;
}

export interface Customization {
  icon: string;
  image: string;
  primary_color: string;
  secondary_color: string;
  tertiary_color: string;
}
