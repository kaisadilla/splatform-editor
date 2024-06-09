export type ParameterType =
    'boolean'
    | 'integer'
    | 'float'
    | 'string'
    | 'tileReference'
    | 'entityReference'
    | 'tileOrEntityReference'
    | 'playerDamageType'
    | 'rewardType'
    | 'blockRegenerationMode'

export interface Trait<T> {
    id: string;
    displayName: string;
    parameters: T;
}

export interface Parameter<T> {
    id: string;
    displayName: string;
    description?: string;
    nullable: boolean;
    type: ParameterType;
    defaultValue: T;
    validValues?: T[];
}

export const PlayerDamageTypeValues = ["regular", "fatal"] as const;
export type PlayerDamageType = typeof PlayerDamageTypeValues[number];

export const RewardTypeParameterValues = ["coin", "tile", "entity"] as const;
export type RewardTypeParameter = typeof RewardTypeParameterValues[number];

export const BlockRegenerationModeValues = ["time", "offscreen"] as const;
export type BlockRegenerationMode = typeof BlockRegenerationModeValues[number];