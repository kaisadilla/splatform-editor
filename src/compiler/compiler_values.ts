import { TraitId } from "data/Traits";
import { BlockRegenerationMode, Direction, EntityDamageType, ObjectAnimationType, PlayerDamageType, PowerUpType, RewardType } from "models/splatform";

export const FILE_TYPE_VALUES = {
    game: 0,
    world: 1,
    level: 2,
};

export const ANIM_TYPE_VALUES: {[key in ObjectAnimationType]: number} = {
    static: 0,
    dynamic: 1,
}

export const TRAIT_ID_INDICES: {[key in TraitId]: number} = {
    // tile traits
    background: 0,
    block: 1,
    breakable: 2,
    fall: 3,
    platform: 4,
    rewardBlock: 5,
    terrain: 6,
    // entity traits
    artificialMove: 1_000_000,
    hurtPlayer: 1_000_001,
    killable: 1_000_002,
    moveAndFire: 1_000_003,
    powerUp: 1_000_004,
    turnIntoShell: 1_000_005,
    walk: 1_000_006,
};

export const DIRECTION_INDICES: {[key in Direction]: number} = {
    up: 0,
    down: 1,
    left: 2,
    right: 3,
};

export const ENTITY_DAMAGE_INDICES: {[key in EntityDamageType]: number} = {
    none: 0,
    regular: 1,
    fatal: 2,
};

export const OBJECT_TYPE_INDICES = {
    tile: 0,
    entity: 2,
    coin: 10,
};

export const PLAYER_DAMAGE_INDICES: {[key in PlayerDamageType]: number} = {
    regular: 1,
    fatal: 2,
};

export const POWER_UP_TYPE: {[key in PowerUpType]: number} = {
    strong: 0,
    fireball: 1,
    frog: 2,
    hammer: 3,
    leaf: 4,
    superball: 5,
    tanooki: 6,
}

export const REGENERATION_MODE_INDICES: {[key in BlockRegenerationMode]: number} = {
    time: 0,
    offscreen: 1,
};