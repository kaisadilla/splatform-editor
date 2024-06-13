import { Direction, EntityDamageType, Parameter, PlayerDamageType, PowerUpType, Trait } from "models/splatform";
import { TraitCollectionOf, TraitWithId } from "./Traits";

const EntityTraits: EntityTraitCollection = {
    artificialMove: {
        id: 'artificialMove',
        displayName: "Artificial move",
        description: "Move in an 'artificial' manner, not controlled by the physics engine.",
        parameters: {
            avoidCliffs: {
                id: 'avoidCliffs',
                displayName: "Avoid cliffs",
                description: "If true, this entity changes turns around before falling to a cliff.",
                nullable: false,
                type: 'boolean',
                defaultValue: false,
            },
            horizontalSpeed: {
                id: 'horizontalSpeed',
                displayName: "Horizontal speed",
                description: "This entity's speed in the x direction.",
                nullable: false,
                type: 'float',
                defaultValue: 80,
            },
            verticalSpeed: {
                id: 'verticalSpeed',
                displayName: "Vertical speed",
                description: "This entity's speed in the y direction.",
                nullable: false,
                type: 'float',
                defaultValue: 160,
            },
        },
    },
    hurtPlayer: {
        id: 'hurtPlayer',
        displayName: "Hurt player",
        description: "Hurt the player when it collides with this entity.",
        parameters: {
            damageType: {
                id: 'damageType',
                displayName: "Damage type",
                description: "The type of damage inflicted on the player.",
                nullable: false,
                type: 'playerDamageType',
                defaultValue: 'regular',
            },
            hurtFromTop: {
                id: 'hurtFromTop',
                displayName: "Hurt from top",
                description: "Whether the player is hurt when it touches this entity's top side.",
                nullable: false,
                type: 'boolean',
                defaultValue: true,
            },
            hurtFromBottom: {
                id: 'hurtFromBottom',
                displayName: "Hurt from bottom",
                description: "Whether the player is hurt when it touches this entity's bottom side.",
                nullable: false,
                type: 'boolean',
                defaultValue: true,
            },
            hurtFromLeft: {
                id: 'hurtFromLeft',
                displayName: "Hurt from left",
                description: "Whether the player is hurt when it touches this entity's left side.",
                nullable: false,
                type: 'boolean',
                defaultValue: true,
            },
            hurtFromRight: {
                id: 'hurtFromRight',
                displayName: "Hurt from right",
                description: "Whether the player is hurt when it touches this entity's right side.",
                nullable: false,
                type: 'boolean',
                defaultValue: true,
            },
        },
    },
    killable: {
        id: 'killable',
        displayName: "Killable",
        description: "Allow this entity to be damaged or killed under certain conditions.",
        parameters: {
            damageFromStomp: {
                id: 'damageFromStomp',
                displayName: "Damage from stomp",
                description: "The type of damage this entity receives when stomped.",
                nullable: false,
                type: 'entityDamageType',
                defaultValue: "regular",
            },
            damageFromFireball: {
                id: 'damageFromFireball',
                displayName: "Damage from fireball",
                description: "The type of damage this entity receives when hit by a player's fireball.",
                nullable: false,
                type: 'entityDamageType',
                defaultValue: "fatal",
            },
        },
    },
    moveAndFire: {
        id: 'moveAndFire',
        displayName: "Move and fire",
        description: "This entity will move to one direction, fire a barrage of bullets, and retreat (in a loop).",
        parameters: {
            bulletAmount: {
                id: 'bulletAmount',
                displayName: "Bullet amount",
                description: "The amount of bullets fired in each barrage.",
                nullable: false,
                type: 'integer',
                defaultValue: 1,
            },
            bulletDamageType: {
                id: 'bulletDamageType',
                displayName: "Bullet's damage type",
                description: "The type of damage the bullet deals to the player.",
                nullable: false,
                type: 'playerDamageType',
                defaultValue: "regular",
            },
            minimumDistanceToActivate: {
                id: 'minimumDistanceToActivate',
                displayName: "Minimum distance to activate behavior",
                description: "The minimum distance from the player to activate this behavior.",
                nullable: false,
                type: 'float',
                defaultValue: 16.0,
            },
            moveDirection: {
                id: 'moveDirection',
                displayName: "Move direction",
                description: "The direction in which this entity will move before firing.",
                nullable: false,
                type: 'direction',
                defaultValue: 'up',
            },
            distanceToMove: {
                id: 'distanceToMove',
                displayName: "Distance to move",
                description: "The amount of distance covered by the move.",
                nullable: false,
                type: 'float',
                defaultValue: 32.0,
            },
            timeToMove: {
                id: 'timeToMove',
                displayName: "Time to move (s)",
                description: "The time it takes this entity to make its move.",
                nullable: false,
                type: 'float',
                defaultValue: 0.6,
            },
            timeToFire: {
                id: 'timeToFire',
                displayName: "Time to fire (s)",
                description: "The time it takes this entity to start its barrage after it has moved into position.",
                nullable: false,
                type: 'float',
                defaultValue: 1.0,
            },
            timeBetweenBullets: {
                id: 'timeBetweenBullets',
                displayName: "Time between bullets (s)",
                description: "The time between each bullet of the barrage.",
                nullable: false,
                type: 'float',
                defaultValue: 1.0,
            },
            timeBetweenMoves: {
                id: 'timeBetweenMoves',
                displayName: "Time between moves (s)",
                description: "The cooldown time between each move.",
                nullable: false,
                type: 'float',
                defaultValue: 1.5,
            },
        },
    },
    powerUp: {
        id: 'powerUp',
        displayName: "Power-up",
        description: "When the player touches this entity, it despawns and gives the player a power up.",
        parameters: {
            powerUpType: {
                id: 'powerUpType',
                displayName: "Power-up type",
                description: "The type of power-up the player receives when taking this.",
                nullable: false,
                type: 'powerUpType',
                defaultValue: "strong",
            },
            overridesBetterPowers: {
                id: 'overridesBetterPowers',
                displayName: "Overrides better power-ups",
                description: "If true, this power-up will replace power-ups that are better than it.",
                nullable: false,
                type: 'boolean',
                defaultValue: false,
            },
        },
    },
    turnIntoShell: {
        id: 'turnIntoShell',
        displayName: "Turn into shell",
        description: "If true, this entity turns into a shell when killed.",
        parameters: {
            shellSpeed: {
                id: 'shellSpeed',
                displayName: "Shell's speed",
                description: "The speed of the shell when rolling around.",
                nullable: false,
                type: 'float',
                defaultValue: 192.0,
            },
            revive: {
                id: 'revive',
                displayName: "Revive",
                description: "If true, this entity will eventually revive if its shell is not moving.",
                nullable: false,
                type: 'boolean',
                defaultValue: true,
            },
            secondsUntilReviveStart: {
                id: 'secondsUntilReviveStart',
                displayName: "Time (s) before revive starts",
                description: "The time it takes for this entity to start channeling its revive.",
                nullable: false,
                type: 'float',
                defaultValue: 6.0,
            },
            secondsUntilReviveEnd: {
                id: 'secondsUntilReviveEnd',
                displayName: "Time (s) spent channeling revive",
                description: "The time it takes for this entity to complete its revival.",
                nullable: false,
                type: 'float',
                defaultValue: 1.0,
            },
        },
    },
    walk: {
        id: 'walk',
        displayName: "Walk",
        description: "This entity walks.",
        parameters: {
            avoidCliffs: {
                id: 'avoidCliffs',
                displayName: "Avoid cliffs",
                description: "If true, this entity changes turns around before falling to a cliff.",
                nullable: false,
                type: 'boolean',
                defaultValue: false,
            },
            walkingSpeed: {
                id: 'walkingSpeed',
                displayName: "Walking speed",
                description: "The soeed at which this entity walks.",
                nullable: false,
                type: 'float',
                defaultValue: 32.0,
            },
        },
    },
};

export type EntityTraitCollection = {
    artificialMove: TraitWithId<'artificialMove', ArtificialMoveEntityParameterCollection>
    hurtPlayer: TraitWithId<'hurtPlayer', HurtPlayerEntityParameterCollection>;
    killable: TraitWithId<'killable', KillableEntityParameterCollection>;
    moveAndFire: TraitWithId<'moveAndFire', MoveAndFireEntityParameterCollection>;
    powerUp: TraitWithId<'powerUp', PowerUpEntityParameterCollection>;
    turnIntoShell: TraitWithId<'turnIntoShell', TurnIntoShellEntityParameterCollection>;
    walk: TraitWithId<'walk', WalkEntityParameterCollection>;
}

export interface ArtificialMoveEntityValueCollection {
    avoidCliffs: boolean;
    horizontalSpeed: number;
    verticalSpeed: number;
}
export type ArtificialMoveEntityParameterCollection
    = TraitCollectionOf<ArtificialMoveEntityValueCollection>;

export interface HurtPlayerEntityValueCollection {
    damageType: PlayerDamageType;
    hurtFromTop: boolean;
    hurtFromBottom: boolean;
    hurtFromLeft: boolean;
    hurtFromRight: boolean;
}
export type HurtPlayerEntityParameterCollection
    = TraitCollectionOf<HurtPlayerEntityValueCollection>;

export interface KillableEntityValueCollection {
    damageFromStomp: EntityDamageType;
    damageFromFireball: EntityDamageType;
}
export type KillableEntityParameterCollection
    = TraitCollectionOf<KillableEntityValueCollection>;

export interface MoveAndFireEntityValueCollection {
    bulletAmount: number;
    bulletDamageType: PlayerDamageType;
    minimumDistanceToActivate: number;
    moveDirection: Direction;
    distanceToMove: number;
    timeToMove: number;
    timeToFire: number;
    timeBetweenBullets: number;
    timeBetweenMoves: number;
}
export type MoveAndFireEntityParameterCollection
    = TraitCollectionOf<MoveAndFireEntityValueCollection>;

export interface PowerUpEntityValueCollection {
    powerUpType: PowerUpType;
    overridesBetterPowers: boolean;
}
export type PowerUpEntityParameterCollection
    = TraitCollectionOf<PowerUpEntityValueCollection>;

export interface TurnIntoShellEntityValueCollection {
    shellSpeed: number;
    revive: boolean;
    secondsUntilReviveStart: number;
    secondsUntilReviveEnd: number;
}
export type TurnIntoShellEntityParameterCollection
    = TraitCollectionOf<TurnIntoShellEntityValueCollection>;

export interface WalkEntityValueCollection {
    avoidCliffs: boolean;
    walkingSpeed: number;
}
export type WalkEntityParameterCollection
    = TraitCollectionOf<WalkEntityValueCollection>;

export type ArtificialMoveEntityParameter = keyof ArtificialMoveEntityParameterCollection;
export type HurtPlayerEntityParameter = keyof HurtPlayerEntityParameterCollection;
export type KillableEntityParameter = keyof KillableEntityParameterCollection;
export type MoveAndFireEntityParameter = keyof MoveAndFireEntityParameterCollection;
export type TurnIntoShellEntityParameter = keyof TurnIntoShellEntityParameterCollection;
export type WalkEntityParameter = keyof WalkEntityParameterCollection;

export type EntityParameterCollection =
    ArtificialMoveEntityParameterCollection
    | HurtPlayerEntityParameterCollection
    | KillableEntityParameterCollection
    | MoveAndFireEntityParameterCollection
    | TurnIntoShellEntityParameterCollection
    | WalkEntityParameterCollection
;

export type EntityValueCollection =
    ArtificialMoveEntityValueCollection
    | HurtPlayerEntityValueCollection
    | KillableEntityValueCollection
    | MoveAndFireEntityValueCollection
    | TurnIntoShellEntityValueCollection
    | WalkEntityValueCollection
;

export type _EntityParamKeys<T> = T extends T ? keyof T : never;
export type EntityTraitParameter = _EntityParamKeys<EntityParameterCollection>;

export default EntityTraits;