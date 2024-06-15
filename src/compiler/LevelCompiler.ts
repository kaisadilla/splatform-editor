import { Level, LevelTile, PlacedTile, TileLayer } from "models/Level";
import { ResourcePack } from "models/ResourcePack";
import { BinaryWriter } from "./BinaryWriter";
import { ANIM_TYPE_VALUES, FILE_TYPE_VALUES, PLAYER_DAMAGE_INDICES, REGENERATION_MODE_INDICES, TRAIT_ID_INDICES } from "./compiler_values";
import { clampNumber } from "utils";
import { ObjectAnimation, ParameterValueCollection, TraitSpecification } from "models/splatform";
import { Tile } from "models/Tile";
import { TileTraitId, TraitId } from "data/Traits";
import { BlockTileValueCollection, BreakableTileValueCollection, FallTileValueCollection } from "data/TileTraits";

const VERSION_MAJOR = 0;
const VERSION_MINOR = 1;
const VERSION_REVISION = 1;

export default function compileLevel (pack: ResourcePack, level: Level) {
    const writer = new BinaryWriter();

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

    writer.writeUint16(level.layers.length); // tileLayerCount
    for (const layer of level.layers) {
        compileTileLayer(writer, pack, layer);
    }
}

function compileTileLayer (writer: BinaryWriter, pack: ResourcePack, layer: TileLayer) {
    writer.writeBoolean(layer.settings.checksCollisions ?? false); // checkCollisions
    writer.writeUint32(layer.tiles.length); // tileCount

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

    writer.writeUint16(spriteIndex); // spriteIndex
    writer.writeUint16(spriteSlices[0]); // xSliceCount
    writer.writeUint16(spriteSlices[1]); // ySliceCount
    writer.writeUint16(animKeys.length); // animationCount

    for (const animKey of animKeys) {
        const anim = tileDef.animations[animKey];
        compileAnimation(writer, anim);
    }

    writer.writeUint8(tileDef.traits.length); // traitCount
    for (const trait of tileDef.traits) {
        compileTrait(writer, pack, tile, tileDef, trait);
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
    writer.writeUint8(anim.frame ?? 1); // frame
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

function compileTrait (
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
            compileTile(writer, pack, values.replacementWhenBroken.object);
        }
        else if (values.replacementWhenBroken?.type === 'entity') {
            // TODO: Entity
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

function _getTraitSpecificationFromTile (tileDef: Tile, traitId: TileTraitId)
    : TraitSpecification<TileTraitId>
{
    const tileDefTrait = tileDef.traits.find(t => t.id === 'block');

    if (tileDefTrait === undefined) {
        throw `Couldn't find trait '${traitId}' in tile '${tileDef.id}'.`;
    }

    return tileDefTrait;
}