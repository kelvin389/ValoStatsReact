export interface Filters {
  KillDeath: FilterKillDeath;
  AttackDefend: FilterAttackDefend;
  PrePostPlant: FilterPrePostPlant;
  TimeRange: [number, number];
}

export enum FilterKillDeath {
  Kill = 0,
  Death = 1,
  Both = 2,
}

export enum FilterAttackDefend {
  Attack = 0,
  Defense = 1,
  Both = 2,
}

export enum FilterPrePostPlant {
  Preplant = 0,
  Postplant = 1,
  Both = 2,
}
