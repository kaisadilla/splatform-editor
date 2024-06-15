import { TraitId } from "data/Traits";
import { BlockRegenerationMode, ObjectAnimationType, PlayerDamageType } from "models/splatform";

export const FILE_TYPE_VALUES = {
    level: 0,
    world: 1,
    game: 2,
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

export const REGENERATION_MODE_INDICES: {[key in BlockRegenerationMode]: number} = {
    time: 0,
    offscreen: 1,
};

export const PLAYER_DAMAGE_INDICES: {[key in PlayerDamageType]: number} = {
    regular: 0,
    fatal: 1,
};