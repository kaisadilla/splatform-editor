import { LevelTile } from "models/Level";
import { Vec2, vec2equals } from "utils";

/**
 * Given a list of level tiles, and a list of positions, returns
 * an array containing the elements in the level's layer that are NOT in
 * the positions given. This can be used, for example, to remove tiles that
 * are in the positions given.
 * @param layerTiles The tiles of a layer in the level.
 * @param positions The positions to remove.
 * @returns 
 */
export function removePositionsFromTileList (
    layerTiles: LevelTile[], positions: Vec2[]
) {
    return layerTiles.filter(
        lt => positions.findIndex(
            tcs => vec2equals(lt.position, tcs),
        ) === -1
    );
}