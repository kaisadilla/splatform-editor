## Entities

The following file describes all the fields in a json describing an entity in
a resource pack (an `.spr-ent` file).

```json
{
    // the type of object, which for entities is always 'entity'.
    "type": "entity",
    // the subtype of object, which is 'enemy' or 'item'.
    "subtype": "enemy",
    // The name of the category to group this tile in, in the editor.
    "category": "Overworld",
    // the display name of the entity, to be shown in the editor.
    "name": "Brown Goomba",

    // NOTE: Collision checks only refer to physics checks. An entity that doesn't
    // collide with a player (for example) can still affect it, hurt it, etc.

    // whether this entity has physics checks with tiles. A value of false allows
    // this entity to pass through tiles (but also fall from the world if it has
    // gravity).
    "collidesWithTiles": true,
    // whether this entity has physics checks with players. A value of false
    // allows the player to stay at the same position as this entity without
    // either pushing each other away.
    "collidesWithPlayers": true,
    // whether this entity has physics checks with other entities. Works similarly
    // to the collisions with players.
    "collidesWithEntities": true,
    // the strength of gravity on this entity. A value of 0 makes the entity
    // ignore gravity.
    "gravityScale": 1,
    // a list of traits this entity has. Traits will be compiled in the exact
    // same order they appear here, which means each trait in the list overrides
    // all traits before it if a conflict arises. For example, when two traits
    // try to play an animation, the trait that is further down this array will
    // be the one who plays the animation.
    "traits": [
        {
            // this trait's id. This name is mapped to an integer when compiled.
            "id": "goomba",
            // default values for all the parameters this trait has. All goombas
            // placed in the world will initially have these values.
            "parameters": {
                "avoidsCliffs": false,
                "startingDirectionRight": false
            },
            // a list of parameters that can be edited on a per-level-entity basis
            // later on. When a goomba is placed in the world, the user can change
            // the value `startingDirectionRight` for that specific goomba.
            // `avoidCliffs`, on the other hand, will always be false for that
            // and every Brown Goomba in the level, and the user will never be
            // shown any option to change it.
            "configurableParameters": [
                "startingDirectionRight"
            ],
            // each trait has a state machine that represents different states in
            // which the entity it controls can be in. Each of these states must
            // be assigned a different animation. For this goomba, usually it'll
            // play its "default" animation, but when it's dead, it'll play its
            // "dead" animation. Note that animations don't necessarily have the
            // same name as the state they represent, and that the same animation
            // may be used for multiple states. Also note that states are not
            // required to be assign any animation. States without assigned
            // animations will play the "default" animation.
            "stateAnimations": {
                "default": "default",
                "dead": "dead"
            }
        }
    ],
    // information about the spritesheet used for this entity.
    "spritesheet": {
        // the name of the sprite, located in the /sprites/entities/ folder.
        "name": "goomba_red",
        // the size, in pixels, of each slice in the spritesheet.
        "sliceSize": [16, 16],
        // the amount of slices in each row and in each column.
        "slices": [3, 1]
    },
    // information about the entity itself (not its sprite).
    "dimensions": {
        // the dimensions of the entity, in pixels. If this value is the same
        // as `spritesheet.sliceSize`, then the sprite will be pixel-perfect. 
        "sprite": [16, 16],
        // a rect describing the position of the collider in relation to the
        // dimensions of the entity. In this case, the collider goes from the
        // (0, 0) point in the entity to its (16, 16) point, which means it
        // fully covers its entire size.
        "collider": [0, 0, 16, 16]
    },
    // a dictionary of animations available for this entity. Each key represents
    // the name of the animation. Note that all entities MUST have an animation
    // named "default".
    "animations": {
        "default": {
            // the type of animation, dynamic = cycles between different frames.
            "type": "dynamic",
            // the frames to play, in order. This animation will play frame 0,
            // then frame 1, then loop.
            "frames": [0, 1],
            // a number, or array of numbers, that represent the time each frame
            // is active (in seconds). If given a number, all frames will be
            // active for that amount of time. If given an array, that array must
            // have the same number of items as the `frames` array.
            "frameTimes": 0.15
        },
        "dead": {
            // static = a single frame.
            "type": "static",
            // the frame used for this animation.
            "frame": 2
        }
    }
}
```