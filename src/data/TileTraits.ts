import { BlockRegenerationMode, Reference, Parameter, PlayerDamageType, RewardType, Trait } from "models/splatform";
import { TraitCollectionOf, TraitWithId } from "./Traits";

const TileTraits: TileTraitCollection = {
    background: {
        id: 'background',
        displayName: "Background",
        parameters: {},
    },
    block: {
        id: 'block',
        displayName: "Block",
        parameters: {
            isHidden: {
                id: 'isHidden',
                displayName: "Is hidden",
                description: "This tile is hidden until the player punches it.",
                nullable: false,
                type: 'boolean',
                defaultValue: false
            },
        }
    },
    breakable: {
        id: 'breakable',
        displayName: "Breakable",
        parameters: {
            breakWhenPunched: {
                id: 'breakWhenPunched',
                displayName: "Break when punched",
                description: "This tile breaks when the player punches it.",
                nullable: false,
                type: 'boolean',
                defaultValue: true
            },
            breakWhenSpin: {
                id: 'breakWhenSpin',
                displayName: "Break when spin",
                description: "This tile breaks when the player hits it from the top while spinning.",
                nullable: false,
                type: 'boolean',
                defaultValue: true
            },
            breakWhenHitByShell: {
                id: 'breakWhenHitByShell',
                displayName: "Break when hit by a shell",
                description: "This tile breaks when a shell hits it in a side.",
                nullable: false,
                type: 'boolean',
                defaultValue: true
            },
            breakWhenHitByRaccoonTail: {
                id: 'breakWhenHitByRaccoonTail',
                displayName: "Break when hit by racoon tail whip",
                description: "This tile breaks when the player whips it with the racoon tail.",
                nullable: false,
                type: 'boolean',
                defaultValue: true
            },
            breakWhenHitByPlayerFireball: {
                id: 'breakWhenHitByPlayerFireball',
                displayName: "Break when hit by player fireball",
                description: "This tile breaks when the player hits it with a fireball.",
                nullable: false,
                type: 'boolean',
                defaultValue: true
            },
            breakWhenHitByEnemyFireball: {
                id: 'breakWhenHitByEnemyFireball',
                displayName: "Break when hit by enemy fireball",
                description: "This tile breaks when hit by an enemy fireball.",
                nullable: false,
                type: 'boolean',
                defaultValue: true
            },
            isReplacedWhenBroken: {
                id: 'isReplacedWhenBroken',
                displayName: "Replace when broken",
                description: "This tile gets replaced by something else in its position when it's broken.",
                nullable: false,
                type: 'boolean',
                defaultValue: false
            },
            replacementWhenBroken: {
                id: 'replacementWhenBroken',
                displayName: "Tile or entity to transform into when broken",
                description: "The tile or entity this tile becomes when it's broken.",
                nullable: true,
                type: 'tileOrEntityReference',
                defaultValue: null
            },
        }
    },
    fall: {
        id: 'fall',
        displayName: "Fall",
        parameters: {
            timeUntilFall: {
                id: 'timeUntilFall',
                displayName: "Time until fall",
                description: "The time, in seconds, before this tile falls.",
                nullable: false,
                type: 'float',
                defaultValue: 1
            },
            shakeBeforeFall: {
                id: 'shakeBeforeFall',
                displayName: "Shake before it falls",
                description: "Whether the block shakes when the condition that makes it fall is active.",
                nullable: false,
                type: 'boolean',
                defaultValue: true
            },
            shakeAfter: {
                id: 'shakeAfter',
                displayName: "Shake delay (s)",
                description: "The delay, in seconds, before this block starts shaking, when it's about to fall.",
                nullable: false,
                type: 'float',
                defaultValue: 0.2
            },
            resetWhenPlayerLeaves: {
                id: 'resetWhenPlayerLeaves',
                displayName: "Reset when player leaves",
                description: "Whether the time to fall resets when the player leaves the block.",
                nullable: false,
                type: 'boolean',
                defaultValue: true
            },
            regenerate: {
                id: 'regenerate',
                displayName: "Regenerate",
                description: "Whether this block regenerates after a while after it falls.",
                nullable: false,
                type: 'boolean',
                defaultValue: true
            },
            regenerationMode: {
                id: 'regenerationMode',
                displayName: "Regeneration mode",
                description: "The way in which this block regenerates.",
                nullable: true,
                type: 'blockRegenerationMode',
                defaultValue: 'time'
            },
            regenerationTime: {
                id: 'regenerationTime',
                displayName: "Regeneration time",
                description: "The time before this block regenerates.",
                nullable: true,
                type: 'float',
                defaultValue: 5
            },
            fallSpeed: {
                id: 'fallSpeed',
                displayName: "Fall speed",
                description: "The speed at which this block falls.",
                nullable: false,
                type: 'float',
                defaultValue: 3
            },
            hasCollisionWhileFalling: {
                id: 'hasCollisionWhileFalling',
                displayName: "Has collision while falling",
                description: "Whether this block still collides with entities while it's falling.",
                nullable: false,
                type: 'boolean',
                defaultValue: false
            },
            canHitPlayers: {
                id: 'canHitPlayers',
                displayName: "Can hit players",
                description: "Whether this block can hit a player while it falls.",
                nullable: false,
                type: 'boolean',
                defaultValue: false
            },
            damageToPlayer: {
                id: 'damageToPlayer',
                displayName: "Damage to player",
                description: "The type of damage applied to the player when this block hits them while falling.",
                nullable: true,
                type: 'playerDamageType',
                defaultValue: 'regular'
            },
        }
    },
    platform: {
        id: 'platform',
        displayName: "Platform",
        parameters: {
            collideFromTop: {
                id: 'collideFromTop',
                displayName: "Collide from top",
                description: "Entities can stand in this tile.",
                nullable: false,
                type: 'boolean',
                defaultValue: true
            },
            collideFromBottom: {
                id: 'collideFromBottom',
                displayName: "Collide from bottom",
                description: "Entities collide with this tile's bottom side.",
                nullable: false,
                type: 'boolean',
                defaultValue: true
            },
            collideFromLeft: {
                id: 'collideFromLeft',
                displayName: "Collide from left",
                description: "Entities collide with this tile's left side.",
                nullable: false,
                type: 'boolean',
                defaultValue: true
            },
            collideFromRight: {
                id: 'collideFromRight',
                displayName: "Collide from right",
                description: "Entities collide with this tile's right side.",
                nullable: false,
                type: 'boolean',
                defaultValue: true
            },
        }
    },
    rewardBlock: {
        id: 'rewardBlock',
        displayName: "Reward block",
        parameters: {
            rewardType: {
                id: 'rewardType',
                displayName: "Reward type",
                description: "The type of reward contained inside this tile.",
                nullable: false,
                type: 'rewardType',
                defaultValue: 'coin'
            },
            reward: {
                id: 'reward',
                displayName: "Reward",
                description: "The reward contained inside this tile.",
                nullable: true,
                type: 'tileOrEntityReference',
                defaultValue: null
            },
            smallPlayerHasDifferentReward: {
                id: 'smallPlayerHasDifferentReward',
                displayName: "Small player has different reward",
                description: "If the player is small, grant a different reward instead.",
                nullable: false,
                type: 'boolean',
                defaultValue: false
            },
            smallPlayerReward: {
                id: 'smallPlayerReward',
                displayName: "Small player's reward",
                description: "If the player is small, override the reward contained in this tile.",
                nullable: true,
                type: 'tileOrEntityReference',
                defaultValue: null
            },
            maxHits: {
                id: 'maxHits',
                displayName: "Max # of hits",
                description: "The maximum number of times this tile can be hit before it becomes empty.",
                nullable: false,
                type: 'integer',
                defaultValue: 1
            },
            maxTime: {
                id: 'maxTime',
                displayName: "Time active (s)",
                description: "The time it takes this tile to become empty after being hit for the first time.",
                nullable: false,
                type: 'float',
                defaultValue: 1
            },
            waitForFinalHitBeforeBecomingEmpty: {
                id: 'waitForFinalHitBeforeBecomingEmpty',
                displayName: "Wait for final hit before becoming empty",
                description: "Wait for a final hit before becoming empty, once the timer runs out.",
                nullable: false,
                type: 'boolean',
                defaultValue: false
            },
            hasBonusForReachingMaxHits: {
                id: 'hasBonusForReachingMaxHits',
                displayName: "Has bonus for reaching max hits",
                description: "If the player hits the max # of hits, grant a special reward in the next hit.",
                nullable: false,
                type: 'boolean',
                defaultValue: false
            },
            bonusForReachingMaxHits: {
                id: 'bonusForReachingMaxHits',
                displayName: "Bonus for reaching max hits",
                description: "The reward for hitting the max # of hits.",
                nullable: true,
                type: 'tileOrEntityReference',
                defaultValue: null
            },
            isReplacedWhenEmptied: {
                id: 'isReplacedWhenEmptied',
                displayName: "Is replaced when it becomes empty",
                description: "Whether this tile will be replaced by a different one when it becomes empty.",
                nullable: false,
                type: 'boolean',
                defaultValue: false
            },
            replacementWhenEmptied: {
                id: 'replacementWhenEmptied',
                displayName: "Replacement when it becomes empty",
                description: "The tile that will replace this one when it becomes empty.",
                nullable: true,
                type: 'tileOrEntityReference',
                defaultValue: null
            },
            revertToCoinAfterFirstHit: {
                id: 'revertToCoinAfterFirstHit',
                displayName: "Revert to coin after first hit",
                description: "Whether this tile rewards coins after the first hit.",
                nullable: false,
                type: 'boolean',
                defaultValue: true
            },
            triggerWhenPunched: {
                id: 'triggerWhenPunched',
                displayName: "Trigger when punched",
                description: "This tile's reward triggers when the player punches it.",
                nullable: false,
                type: 'boolean',
                defaultValue: true
            },
            triggerWhenSpin: {
                id: 'triggerWhenSpin',
                displayName: "Trigger when spin",
                description: "This tile's reward triggers when the player hits it from the top while spinning.",
                nullable: false,
                type: 'boolean',
                defaultValue: true
            },
            triggerWhenHitByShell: {
                id: 'triggerWhenHitByShell',
                displayName: "Trigger when hit by a shell",
                description: "This tile's reward triggers when a shell hits it in a side.",
                nullable: false,
                type: 'boolean',
                defaultValue: true
            },
            triggerWhenHitByRaccoonTail: {
                id: 'triggerWhenHitByRaccoonTail',
                displayName: "Trigger when hit by racoon tail whip",
                description: "This tile's reward triggers when the player whips it with the racoon tail.",
                nullable: false,
                type: 'boolean',
                defaultValue: true
            },
            triggerWhenHitByPlayerFireball: {
                id: 'triggerWhenHitByPlayerFireball',
                displayName: "Trigger when hit by player fireball",
                description: "This tile's reward triggers when the player hits it with a fireball.",
                nullable: false,
                type: 'boolean',
                defaultValue: false
            },
            triggerWhenHitByEnemyFireball: {
                id: 'triggerWhenHitByEnemyFireball',
                displayName: "Trigger when hit by enemy fireball",
                description: "This tile's reward triggers when hit by an enemy fireball.",
                nullable: false,
                type: 'boolean',
                defaultValue: false
            },
        }
    },
    terrain: {
        id: 'terrain',
        displayName: "Terrain",
        parameters: {},
    },
}

export type TileTraitCollection = {
    background: TraitWithId<'background', BackgroundTileParameterCollection>
    block: TraitWithId<'block', BlockTileParameterCollection>;
    breakable: TraitWithId<'breakable', BreakableTileParameterCollection>;
    fall: TraitWithId<'fall', FallTileParameterCollection>;
    platform: TraitWithId<'platform', PlatformTileParameterCollection>;
    rewardBlock: TraitWithId<'rewardBlock', RewardBlockTileParameterCollection>;
    terrain: TraitWithId<'terrain', TerrainTileParameterCollection>
}

export interface BackgroundTileValueCollection {
    
}
export type BackgroundTileParameterCollection
    = TraitCollectionOf<BackgroundTileValueCollection>;

export interface BlockTileValueCollection {
    isHidden: boolean;
}
export type BlockTileParameterCollection
    = TraitCollectionOf<BlockTileValueCollection>;

export interface BreakableTileValueCollection {
    breakWhenPunched: boolean;
    breakWhenSpin: boolean;
    breakWhenHitByShell: boolean;
    breakWhenHitByRaccoonTail: boolean;
    breakWhenHitByPlayerFireball: boolean;
    breakWhenHitByEnemyFireball: boolean;
    isReplacedWhenBroken: boolean;
    replacementWhenBroken: Reference | null;
}
export type BreakableTileParameterCollection
    = TraitCollectionOf<BreakableTileValueCollection>;

export interface FallTileValueCollection {
    timeUntilFall: number;
    shakeBeforeFall: boolean;
    shakeAfter: number;
    resetWhenPlayerLeaves: boolean;
    regenerate: boolean;
    regenerationMode: BlockRegenerationMode | null;
    regenerationTime: number;
    fallSpeed: number;
    hasCollisionWhileFalling: boolean;
    canHitPlayers: boolean;
    damageToPlayer: PlayerDamageType;
}
export type FallTileParameterCollection
    = TraitCollectionOf<FallTileValueCollection>;

export interface PlatformTileValueCollection {
    collideFromTop: boolean;
    collideFromBottom: boolean;
    collideFromLeft: boolean;
    collideFromRight: boolean;
}
export type PlatformTileParameterCollection
    = TraitCollectionOf<PlatformTileValueCollection>;

export interface RewardBlockTileValueCollection {
    rewardType: RewardType;
    reward: Reference | null;
    smallPlayerHasDifferentReward: boolean;
    smallPlayerReward: Reference | null;
    maxHits: number;
    maxTime: number;
    waitForFinalHitBeforeBecomingEmpty: boolean;
    hasBonusForReachingMaxHits: boolean;
    bonusForReachingMaxHits: Reference | null;
    isReplacedWhenEmptied: boolean;
    replacementWhenEmptied: Reference | null;
    revertToCoinAfterFirstHit: boolean;
    triggerWhenPunched: boolean;
    triggerWhenSpin: boolean;
    triggerWhenHitByShell: boolean;
    triggerWhenHitByRaccoonTail: boolean;
    triggerWhenHitByPlayerFireball: boolean;
    triggerWhenHitByEnemyFireball: boolean;
}
export type RewardBlockTileParameterCollection
    = TraitCollectionOf<RewardBlockTileValueCollection>;

export interface TerrainTileValueCollection {
    
}
export type TerrainTileParameterCollection
    = TraitCollectionOf<TerrainTileValueCollection>;

export type BackgroundTileParameter = keyof BackgroundTileParameterCollection;
export type BlockTileParameter = keyof BlockTileParameterCollection;
export type BreakableTileParameter = keyof BreakableTileParameterCollection;
export type FallTileParameter = keyof FallTileParameterCollection;
export type PlatformTileParameter = keyof PlatformTileParameterCollection;
export type RewardBlockTileParameter = keyof RewardBlockTileParameterCollection;
export type TerrainTileParameter = keyof TerrainTileParameterCollection;

export type TileParameterCollection = 
    BackgroundTileParameterCollection
    | BlockTileParameterCollection
    | BreakableTileParameterCollection
    | FallTileParameterCollection
    | PlatformTileParameterCollection
    | RewardBlockTileParameterCollection
    | TerrainTileParameterCollection
;

export type TileValueCollection = 
    BackgroundTileValueCollection
    | BlockTileValueCollection
    | BreakableTileValueCollection
    | FallTileValueCollection
    | PlatformTileValueCollection
    | RewardBlockTileValueCollection
    | TerrainTileValueCollection
;

export type _TileParamKeys<T> = T extends T ? keyof T : never;
export type TileTraitParameter = _TileParamKeys<TileParameterCollection>;

export default TileTraits;