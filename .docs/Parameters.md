## Parameter types

### boolean
Represents a boolean value. In TS, these values are stored as a boolean
value.

### integer
Represents an integer value. In TS, these values are stored as numbers, and
are controlled so they do not have a decimal part.

### float
Represents a floating point value. In TS, these values are stored as numbers.

### tileReference
Represents a reference to a tile or tile entity. In TS, these values are stored
as strings in the following format `<'tile'|'entity'>:<item_id>`. For example,
a super mushroom would be `entity:super_mushroom`, while a question block would
be `tile:question_block`. Note that the first part represents the type of item
the value actually is, which means that a tile entity is marked as `entity` even
if it's used as a tile.

### entityReference
Represents a reference to an entity. In TS, these values are stored as strings,
in the same format as tileReferences. Note that, even though, currently, entity
references can only reference `entity` items, marking them explicitly is still
necessary - i.e. a Goomba must be `entity:goomba` rather than just `goomba`.

### playerDamageType
Represents the type of damage the player can get. In TS, these values are stored
as PlayerDamageType, which is a string type with values `'regular'` and `'fatal'`.

### rewardType
Represents the type of reward a player can get. In TS, these values are stored
as RewardType, which is a string type with values `'coin'`, `'tile'` and
`'entity'`.

### blockRegenerationMode
Represents the way a block can respawn. In TS, these values are stored
as BlockRegenerationMode, which is a string type with values `'time'` and
`'offscreen'`.
