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

export type RewardTypeParameterValue = 'coin' | 'tile' | 'entity';
export type PlayerDamageType = 'regular' | 'fatal';
export type BlockRegenerationMode = 'time' | 'offscreen';