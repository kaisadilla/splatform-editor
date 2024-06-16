import { ArtificialMoveEntityValueCollection, HurtPlayerEntityValueCollection, KillableEntityValueCollection, MoveAndFireEntityValueCollection, PowerUpEntityValueCollection, TurnIntoShellEntityValueCollection, WalkEntityValueCollection } from "data/EntityTraits";
import { BlockTileValueCollection, BreakableTileValueCollection, FallTileValueCollection, PlatformTileValueCollection, RewardBlockTileValueCollection } from "data/TileTraits";
import { EntityTraitId, TileTraitId, TraitId } from "data/Traits";
import { Entity } from "models/Entity";
import { Level, LevelEntity, LevelSpawn, LevelTile, PlacedTile, TileLayer } from "models/Level";
import { ResourcePack } from "models/ResourcePack";
import { Tile } from "models/Tile";
import { ObjectAnimation, TraitSpecification } from "models/splatform";
import { BinaryWriter } from "./BinaryWriter";
import { ANIM_TYPE_VALUES, DIRECTION_INDICES, ENTITY_DAMAGE_INDICES, FILE_TYPE_VALUES, OBJECT_TYPE_INDICES, PLAYER_DAMAGE_INDICES, POWER_UP_TYPE, REGENERATION_MODE_INDICES, TRAIT_ID_INDICES } from "./compiler_values";

const VERSION_MAJOR = 0;
const VERSION_MINOR = 1;
const VERSION_REVISION = 1;

export default function compileLevel (pack: ResourcePack, level: Level) : Uint8Array {
    const writer = new BinaryWriter();

    writer.writeUint8(0xA7); // magic number byte 1
    writer.writeUint8(0xA5); // magic number byte 2
    writer.writeUint8(0x1A); // magic number byte 3
    writer.writeUint8(0x42); // magic number byte 4
    writer.writeUint8(0); // endianSignature
    writer.writeUint8(FILE_TYPE_VALUES.level); // fileType
    writer.writeUint8(VERSION_MAJOR); // versionMajor
    writer.writeUint8(VERSION_MINOR); // versionMajor
    writer.writeUint8(VERSION_REVISION); // versionMajor

    writer.writeUint16(level.settings.width); // width
    writer.writeUint16(level.settings.height); // height

    writer.writeUint16(
        pack.backgrounds.findIndex(b => b.id === level.settings.background)
    ); // background
    writer.writeUint16(
        pack.music.findIndex(m => m.id === level.settings.music)
    ); // music
    writer.writeUint16(level.settings.time); // time

    writer.writeUint8(level.layers.length); // tileLayerCount
    for (const layer of level.layers) {
        compileTileLayer(writer, pack, layer); // tileLayers[]
    }

    writer.writeUint16(level.spawns.length); // spawnCount
    for (const spawn of level.spawns) {
        compileSpawn(writer, pack, spawn); // spawns[]
    }

    return writer.getBuffer();
}

function compileTileLayer (writer: BinaryWriter, pack: ResourcePack, layer: TileLayer) {
    writer.writeBoolean(layer.settings.checksCollisions ?? false); // checkCollisions
    writer.writeInt32(layer.tiles.length); // tileCount

    for (const tile of layer.tiles) {
        compilePlacedTile(writer, pack, tile);
    }
}

function compilePlacedTile (writer: BinaryWriter, pack: ResourcePack, tile: PlacedTile) {
    writer.writeUint16(tile.position.x); // xPos
    writer.writeUint16(tile.position.y); // yPos
    compileTile(writer, pack, tile); // tile
}

function compileTile (writer: BinaryWriter, pack: ResourcePack, tile: LevelTile) {
    const tileDef = pack.tilesById[tile.tileId].data;
    const spriteIndex = pack.sprites.tiles.findIndex(
        t => t.id === tileDef.spritesheet.name
    );
    const spriteSlices = tileDef.spritesheet.slices ?? [1, 1];

    const animKeys = Object.keys(tileDef.animations);

    writer.writeInt32(spriteIndex); // spriteIndex
    writer.writeUint8(spriteSlices[0]); // xSliceCount
    writer.writeUint8(spriteSlices[1]); // ySliceCount

    writer.writeUint16(animKeys.length); // animationCount
    for (const animKey of animKeys) {
        const anim = tileDef.animations[animKey];
        compileAnimation(writer, anim);
    }

    writer.writeUint8(tileDef.traits.length); // traitCount
    for (const trait of tileDef.traits) {
        compileTileTrait(writer, pack, tile, tileDef, trait); // traits[]
    }
}

function compileAnimation (
    writer: BinaryWriter, anim: ObjectAnimation
) {
    if (anim.type === 'static') {
        writer.writeUint8(ANIM_TYPE_VALUES.static); // animType
        compileStaticAnimation(writer, anim); // StaticAnimation
    }
    else if (anim.type === 'dynamic') {
        writer.writeUint8(ANIM_TYPE_VALUES.dynamic); // animType
        compileDynamicAnimation(writer, anim); // DynamicAnimation
    }
}

function compileStaticAnimation (
    writer: BinaryWriter, anim: ObjectAnimation
) {
    writer.writeUint8(anim.frame ?? 0); // frame
}

function compileDynamicAnimation (
    writer: BinaryWriter, anim: ObjectAnimation
) {
    let frames = anim.frames ?? anim.frame ?? 1;
    if (typeof frames === 'number') {
        frames = [frames];
    }

    writer.writeUint8(frames.length); // frameCount;
    for (const f of frames) {
        writer.writeUint16(f); // frame[i]
    }

    let frameTimes = anim.frameTimes!;
    if (typeof frameTimes === 'number') {
        frameTimes = [frameTimes];
    }

    writer.writeUint8(frameTimes.length); // frameTimesCount;
    for (const t of frameTimes) {
        writer.writeUint16(t); // frameTimes[i]
    }
    
}

function compileSpawn (
    writer: BinaryWriter, pack: ResourcePack, spawn: LevelSpawn
) {
    writer.writeFloat32(spawn.position.x); // xPos
    writer.writeFloat32(spawn.position.y); // yPos
    compileEntity(writer, pack, spawn.entity); // entity
}

function compileEntity (
    writer: BinaryWriter, pack: ResourcePack, entity: LevelEntity
) {
    const entityDef = pack.entitiesById[entity.entityId].data;
    const spriteIndex = pack.sprites.entities.findIndex(
        t => t.id === entityDef.spritesheet.name
    );

    const sliceSizes = entityDef.spritesheet.sliceSize ?? [16, 16];
    const sliceCounts = entityDef.spritesheet.slices ?? [1, 1];

    const animKeys = Object.keys(entityDef.animations);

    writer.writeInt32(spriteIndex); // spriteIndex
    writer.writeUint16(sliceSizes[0]); // xSliceSize
    writer.writeUint16(sliceSizes[1]); // ySliceSize
    writer.writeUint16(sliceCounts[0]); // xSliceCount
    writer.writeUint16(sliceCounts[1]); // ySliceCount

    writer.writeUint16(animKeys.length); // animationCount
    for (const animKey of animKeys) {
        const anim = entityDef.animations[animKey];
        compileAnimation(writer, anim);
    }

    writer.writeUint16(entityDef.dimensions.sprite[0]); // xSize
    writer.writeUint16(entityDef.dimensions.sprite[1]); // ySize
    writer.writeUint16(entityDef.dimensions.collider[0]); // colliderLeft
    writer.writeUint16(entityDef.dimensions.collider[1]); // colliderTop
    writer.writeUint16(entityDef.dimensions.collider[2]); // colliderWidth
    writer.writeUint16(entityDef.dimensions.collider[3]); // colliderHeight

    writer.writeBoolean(entityDef.collidesWithTiles); // collidesWithTiles
    writer.writeBoolean(entityDef.collidesWithEntities); // collidesWithEntities
    writer.writeBoolean(entityDef.collidesWithPlayers); // collidesWithPlayers
    writer.writeFloat32(entityDef.gravityScale); // gravityScale

    writer.writeUint8(entityDef.traits.length); // traitCount
    for (const trait of entityDef.traits) {
        compileEntityTrait(writer, pack, entity, entityDef, trait); // traits[]
    }
}

function compileTileTrait (
    writer: BinaryWriter,
    pack: ResourcePack,
    tile: LevelTile,
    tileDef: Tile,
    trait: TraitSpecification<TraitId>
) {
    if (trait.id === 'background') {
        compileBackgroundTileTrait(writer, pack, tile, tileDef);
    }
    else if (trait.id === 'block') {
        compileBlockTileTrait(writer, pack, tile, tileDef);
    }
    else if (trait.id === 'breakable') {
        compileBreakableTileTrait(writer, pack, tile, tileDef);
    }
    else if (trait.id === 'fall') {
        compileFallTileTrait(writer, pack, tile, tileDef);
    }
    else if (trait.id === 'platform') {
        compilePlatformTileTrait(writer, pack, tile, tileDef);
    }
    else if (trait.id === 'rewardBlock') {
        compileRewardTileTrait(writer, pack, tile, tileDef);
    }
    else if (trait.id === 'terrain') {
        compileTerrainTileTrait(writer, pack, tile, tileDef);
    }
    else {
        throw `Unknown tile trait '${trait.id}'.`;
    }
}

function compileBackgroundTileTrait (
    writer: BinaryWriter,
    pack: ResourcePack,
    tile: LevelTile,
    tileDef: Tile,
) {
    writer.writeUint32(TRAIT_ID_INDICES.background); // traitId

    // no parameters
}

function compileBlockTileTrait (
    writer: BinaryWriter,
    pack: ResourcePack,
    tile: LevelTile,
    tileDef: Tile,
) {
    writer.writeUint32(TRAIT_ID_INDICES.block); // traitId
    
    const tileDefTrait = _getTraitSpecificationFromTile(tileDef, 'block');

    const values: BlockTileValueCollection = {
        ...tileDefTrait.parameters as BlockTileValueCollection,
        ...tile.parameters,
    }
    
    writer.writeBoolean(values.isHidden); // isHidden
}

function compileBreakableTileTrait (
    writer: BinaryWriter,
    pack: ResourcePack,
    tile: LevelTile,
    tileDef: Tile,
) {
    writer.writeUint32(TRAIT_ID_INDICES.breakable); // traitId
    
    const tileDefTrait = _getTraitSpecificationFromTile(tileDef, 'breakable');

    const values: BreakableTileValueCollection = {
        ...tileDefTrait.parameters as BreakableTileValueCollection,
        ...tile.parameters,
    }
    
    writer.writeBoolean(values.breakWhenPunched); // breakWhenPunched
    writer.writeBoolean(values.breakWhenSpin); // breakWhenSpin
    writer.writeBoolean(values.breakWhenHitByShell); // breakWhenHitByShell
    writer.writeBoolean(values.breakWhenHitByRaccoonTail); // breakWhenHitByRaccoonTail
    writer.writeBoolean(values.breakWhenHitByPlayerFireball); // breakWhenHitByPlayerFireball
    writer.writeBoolean(values.breakWhenHitByEnemyFireball); // breakWhenHitByEnemyFireball
    writer.writeBoolean(values.isReplacedWhenBroken); // isReplacedWhenBroken

    if (values.isReplacedWhenBroken) {
        if (values.replacementWhenBroken?.type === 'tile') {
            writer.writeUint8(OBJECT_TYPE_INDICES.tile); // replacementWhenBrokenType
            compileTile(writer, pack, values.replacementWhenBroken.object);
        }
        else if (values.replacementWhenBroken?.type === 'entity') { // replacementWhenBroken
            writer.writeUint8(OBJECT_TYPE_INDICES.entity); // replacementWhenBrokenType
            compileEntity(writer, pack, values.replacementWhenBroken.object); // replacementWhenBroken
        }
    }
}

function compileFallTileTrait (
    writer: BinaryWriter,
    pack: ResourcePack,
    tile: LevelTile,
    tileDef: Tile,
) {
    writer.writeUint32(TRAIT_ID_INDICES.fall); // traitId
    
    const tileDefTrait = _getTraitSpecificationFromTile(tileDef, 'breakable');

    const values: FallTileValueCollection = {
        ...tileDefTrait.parameters as FallTileValueCollection,
        ...tile.parameters,
    }
    
    writer.writeFloat32(values.timeUntilFall); // timeUntilFall
    writer.writeBoolean(values.shakeBeforeFall); // shakeBeforeFall
    writer.writeFloat32(values.shakeAfter); // shakeAfter
    writer.writeBoolean(values.resetWhenPlayerLeaves); // resetWhenPlayerLeaves
    writer.writeBoolean(values.regenerate); // regenerate
    
    if (values.regenerate === true) {
        writer.writeUint8(REGENERATION_MODE_INDICES[values.regenerationMode!]); // regenerationMode
        
        if (values.regenerationMode === 'time') {
            writer.writeFloat32(values.regenerationTime); // regenerationTime
        }
    }

    writer.writeFloat32(values.fallSpeed); // fallSpeed
    writer.writeBoolean(values.hasCollisionWhileFalling); // hasCollisionWhileFalling

    if (values.hasCollisionWhileFalling) {
        writer.writeBoolean(values.canHitPlayers); // canHitPlayers

        if (values.canHitPlayers) {
            writer.writeUint8(PLAYER_DAMAGE_INDICES[values.damageToPlayer!]); // damageToPlayer
        }
    }
}

function compilePlatformTileTrait (
    writer: BinaryWriter,
    pack: ResourcePack,
    tile: LevelTile,
    tileDef: Tile,
) {
    writer.writeUint32(TRAIT_ID_INDICES.platform); // traitId
    
    const tileDefTrait = _getTraitSpecificationFromTile(tileDef, 'breakable');

    const values: PlatformTileValueCollection = {
        ...tileDefTrait.parameters as PlatformTileValueCollection,
        ...tile.parameters,
    }
    
    writer.writeBoolean(values.collideFromTop); // collideFromTop
    writer.writeBoolean(values.collideFromBottom); // collideFromBottom
    writer.writeBoolean(values.collideFromLeft); // collideFromLeft
    writer.writeBoolean(values.collideFromRight); // collideFromRight
}

function compileRewardTileTrait (
    writer: BinaryWriter,
    pack: ResourcePack,
    tile: LevelTile,
    tileDef: Tile,
) {
    writer.writeUint32(TRAIT_ID_INDICES.rewardBlock); // traitId

    const tileDefTrait = _getTraitSpecificationFromTile(tileDef, 'rewardBlock');

    const values: RewardBlockTileValueCollection = {
        ...tileDefTrait.parameters as RewardBlockTileValueCollection,
        ...tile.parameters,
    }
    
    if (values.rewardType === 'coin' || values.reward === null) {
        writer.writeUint8(OBJECT_TYPE_INDICES.coin); // rewardType
    }
    else if (values.rewardType === 'item') {
        if (values.reward.type === 'tile') {
            writer.writeUint8(OBJECT_TYPE_INDICES.tile); // rewardType
            compileTile(writer, pack, values.reward.object); // reward
        }
        else if (values.reward.type === 'entity') {
            writer.writeUint8(OBJECT_TYPE_INDICES.entity); // rewardType
            compileEntity(writer, pack, values.reward!.object); // TODO: Entity // reward
        }
    }

    writer.writeBoolean(values.smallPlayerHasDifferentReward); // smallPlayerHasDifferentReward
    if (values.smallPlayerHasDifferentReward) {
        if (values.smallPlayerReward!.type === 'tile') {
            writer.writeUint8(OBJECT_TYPE_INDICES.tile); // smallPlayerRewardType
            compileTile(writer, pack, values.smallPlayerReward!.object); // smallPlayerReward
        }
        else if (values.smallPlayerReward!.type === 'entity') {
            writer.writeUint8(OBJECT_TYPE_INDICES.tile); // smallPlayerRewardType
            compileEntity(writer, pack, values.smallPlayerReward!.object); // smallPlayerReward
        }
    }

    writer.writeUint8(values.maxHits); // maxHits
    writer.writeFloat32(values.maxTime); // maxTime
    writer.writeBoolean(values.waitForFinalHitBeforeBecomingEmpty); // waitForFinalHitBeforeBecomingEmpty
    
    writer.writeBoolean(values.hasBonusForReachingMaxHits); // hasBonusForReachingMaxHits
    if (values.hasBonusForReachingMaxHits) {
        if (values.bonusForReachingMaxHits!.type === 'tile') {
            writer.writeUint8(OBJECT_TYPE_INDICES.tile); // bonusForReachingMaxHitsType
            compileTile(writer, pack, values.bonusForReachingMaxHits!.object); // bonusForReachingMaxHits
        }
        if (values.bonusForReachingMaxHits!.type === 'entity') {
            writer.writeUint8(OBJECT_TYPE_INDICES.entity); // bonusForReachingMaxHitsType
            compileEntity(writer, pack, values.bonusForReachingMaxHits!.object); // bonusForReachingMaxHits
        }
    }

    writer.writeBoolean(values.isReplacedWhenEmptied); // isReplacedWhenEmptied
    if (values.isReplacedWhenEmptied) {
        if (values.replacementWhenEmptied!.type === 'tile') {
            writer.writeUint8(OBJECT_TYPE_INDICES.tile); // replacementWhenEmptiedType
            compileTile(writer, pack, values.replacementWhenEmptied!.object); // replacementWhenEmptied
        }
        if (values.replacementWhenEmptied!.type === 'entity') {
            writer.writeUint8(OBJECT_TYPE_INDICES.entity); // replacementWhenEmptiedType
            compileEntity(writer, pack, values.replacementWhenEmptied!.object); // replacementWhenEmptied
        }
    }

    writer.writeBoolean(values.revertToCoinAfterFirstHit); // revertToCoinAfterFirstHit
    writer.writeBoolean(values.triggerWhenPunched); // triggerWhenPunched
    writer.writeBoolean(values.triggerWhenSpin); // triggerWhenSpin
    writer.writeBoolean(values.triggerWhenHitByShell); // triggerWhenHitByShell
    writer.writeBoolean(values.triggerWhenHitByRaccoonTail); // triggerWhenHitByRaccoonTail
    writer.writeBoolean(values.triggerWhenHitByPlayerFireball); // triggerWhenHitByPlayerFireball
    writer.writeBoolean(values.triggerWhenHitByEnemyFireball); // triggerWhenHitByEnemyFireball
}

function compileTerrainTileTrait (
    writer: BinaryWriter,
    pack: ResourcePack,
    tile: LevelTile,
    tileDef: Tile,
) {
    writer.writeUint32(TRAIT_ID_INDICES.terrain); // traitId

    // no parameters
}

function compileEntityTrait (
    writer: BinaryWriter,
    pack: ResourcePack,
    entity: LevelEntity,
    entityDef: Entity,
    trait: TraitSpecification<TraitId>
) {
    if (trait.id === 'artificialMove') {
        compileArtificialMoveEntityTrait(writer, pack, entity, entityDef);
    }
    else if (trait.id === 'hurtPlayer') {
        compileHurtPlayerEntityTrait(writer, pack, entity, entityDef);
    }
    else if (trait.id === 'killable') {
        compileKillableEntityTrait(writer, pack, entity, entityDef);
    }
    else if (trait.id === 'moveAndFire') {
        compileMoveAndFireEntityTrait(writer, pack, entity, entityDef);
    }
    else if (trait.id === 'powerUp') {
        compilePowerUpEntityTrait(writer, pack, entity, entityDef);
    }
    else if (trait.id === 'turnIntoShell') {
        compileTurnIntoShellEntityTrait(writer, pack, entity, entityDef);
    }
    else if (trait.id === 'walk') {
        compileWalkEntityTrait(writer, pack, entity, entityDef);
    }
    else {
        throw `Unknown entity trait '${trait.id}'.`;
    }
}

function compileArtificialMoveEntityTrait (
    writer: BinaryWriter,
    pack: ResourcePack,
    entity: LevelEntity,
    entityDef: Entity,
) {
    writer.writeUint32(TRAIT_ID_INDICES.artificialMove); // traitId
    
    const tileDefTrait = _getTraitSpecificationFromEntity(entityDef, 'artificialMove');

    const values: ArtificialMoveEntityValueCollection = {
        ...tileDefTrait.parameters as ArtificialMoveEntityValueCollection,
        ...entity.parameters,
    }
    
    writer.writeBoolean(values.avoidCliffs); // avoidCliffs
    writer.writeFloat32(values.horizontalSpeed); // horizontalSpeed
    writer.writeFloat32(values.verticalSpeed); // verticalSpeed+
}

function compileHurtPlayerEntityTrait (
    writer: BinaryWriter,
    pack: ResourcePack,
    entity: LevelEntity,
    entityDef: Entity,
) {
    writer.writeUint32(TRAIT_ID_INDICES.hurtPlayer); // traitId
    
    const tileDefTrait = _getTraitSpecificationFromEntity(entityDef, 'hurtPlayer');

    const values: HurtPlayerEntityValueCollection = {
        ...tileDefTrait.parameters as HurtPlayerEntityValueCollection,
        ...entity.parameters,
    }
    
    writer.writeUint8(PLAYER_DAMAGE_INDICES[values.damageType]); // damageType
    writer.writeBoolean(values.hurtFromTop); // hurtFromTop
    writer.writeBoolean(values.hurtFromBottom); // hurtFromBottom
    writer.writeBoolean(values.hurtFromLeft); // hurtFromLeft
    writer.writeBoolean(values.hurtFromRight); // hurtFromRight
}

function compileKillableEntityTrait (
    writer: BinaryWriter,
    pack: ResourcePack,
    entity: LevelEntity,
    entityDef: Entity,
) {
    writer.writeUint32(TRAIT_ID_INDICES.killable); // traitId
    
    const tileDefTrait = _getTraitSpecificationFromEntity(entityDef, 'killable');

    const values: KillableEntityValueCollection = {
        ...tileDefTrait.parameters as KillableEntityValueCollection,
        ...entity.parameters,
    }
    
    writer.writeUint8(ENTITY_DAMAGE_INDICES[values.damageFromStomp]); // damageFromStomp
    writer.writeUint8(ENTITY_DAMAGE_INDICES[values.damageFromFireball]); // damageFromFireball
}

function compileMoveAndFireEntityTrait (
    writer: BinaryWriter,
    pack: ResourcePack,
    entity: LevelEntity,
    entityDef: Entity,
) {
    writer.writeUint32(TRAIT_ID_INDICES.moveAndFire); // traitId
    
    const tileDefTrait = _getTraitSpecificationFromEntity(entityDef, 'moveAndFire');

    const values: MoveAndFireEntityValueCollection = {
        ...tileDefTrait.parameters as MoveAndFireEntityValueCollection,
        ...entity.parameters,
    };
    
    writer.writeUint8(values.bulletAmount); // bulletAmount
    writer.writeUint8(PLAYER_DAMAGE_INDICES[values.bulletDamageType]); // bulletDamageType
    writer.writeUint16(values.minimumDistanceToActivate); // minimumDistanceToActivate
    writer.writeUint8(DIRECTION_INDICES[values.moveDirection]); // moveDirection
    writer.writeUint16(values.distanceToMove); // distanceToMove

    writer.writeFloat32(values.timeToMove); // timeToMove
    writer.writeFloat32(values.timeToFire); // timeToFire
    writer.writeFloat32(values.timeBetweenBullets); // timeBetweenBullets
    writer.writeFloat32(values.timeBetweenMoves); // timeBetweenMoves
}

function compilePowerUpEntityTrait (
    writer: BinaryWriter,
    pack: ResourcePack,
    entity: LevelEntity,
    entityDef: Entity,
) {
    writer.writeUint32(TRAIT_ID_INDICES.powerUp); // traitId
    
    const tileDefTrait = _getTraitSpecificationFromEntity(entityDef, 'powerUp');

    const values: PowerUpEntityValueCollection = {
        ...tileDefTrait.parameters as PowerUpEntityValueCollection,
        ...entity.parameters,
    };
    
    writer.writeUint8(POWER_UP_TYPE[values.powerUpType]); // powerUpType
    writer.writeBoolean(values.overridesBetterPowers); // overridesBetterPowers
}

function compileTurnIntoShellEntityTrait (
    writer: BinaryWriter,
    pack: ResourcePack,
    entity: LevelEntity,
    entityDef: Entity,
) {
    writer.writeUint32(TRAIT_ID_INDICES.turnIntoShell); // traitId
    
    const tileDefTrait = _getTraitSpecificationFromEntity(entityDef, 'turnIntoShell');

    const values: TurnIntoShellEntityValueCollection = {
        ...tileDefTrait.parameters as TurnIntoShellEntityValueCollection,
        ...entity.parameters,
    };
    
    writer.writeFloat32(values.shellSpeed); // shellSpeed

    writer.writeBoolean(values.revive); // revive
    if (values.revive) {
        writer.writeFloat32(values.secondsUntilReviveStart); // secondsUntilReviveStart
        writer.writeFloat32(values.secondsUntilReviveEnd); // secondsUntilReviveEnd
    }
}

function compileWalkEntityTrait (
    writer: BinaryWriter,
    pack: ResourcePack,
    entity: LevelEntity,
    entityDef: Entity,
) {
    writer.writeUint32(TRAIT_ID_INDICES.walk); // traitId
    
    const tileDefTrait = _getTraitSpecificationFromEntity(entityDef, 'walk');

    const values: WalkEntityValueCollection = {
        ...tileDefTrait.parameters as WalkEntityValueCollection,
        ...entity.parameters,
    };
    
    writer.writeBoolean(values.avoidCliffs); // avoidCliffs
    writer.writeFloat32(values.walkingSpeed); // walkingSpeed
}

function _getTraitSpecificationFromTile (tileDef: Tile, traitId: TileTraitId)
    : TraitSpecification<TileTraitId>
{
    const tileDefTrait = tileDef.traits.find(t => t.id === traitId);

    if (tileDefTrait === undefined) {
        throw `Couldn't find trait '${traitId}' in tile '${tileDef.id}'.`;
    }

    return tileDefTrait;
}

function _getTraitSpecificationFromEntity (entityDef: Entity, traitId: EntityTraitId)
    : TraitSpecification<EntityTraitId>
{
    const entityDefTrait = entityDef.traits.find(t => t.id === traitId);

    if (entityDefTrait === undefined) {
        throw `Couldn't find trait '${traitId}' in entity '${entityDef.id}'.`;
    }

    return entityDefTrait;
}