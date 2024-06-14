import { useLevelEditorContext } from "context/useLevelEditorContext";
import { Level, LevelSpawn, PlacedTile, TileLayer, getNewLevelEntity, getNewLevelTile } from "models/Level";
import { ResourcePack } from "models/ResourcePack";
import { Rect, Vec2, isVec2WithinRect, vec2equals, vec2toString } from "utils";
import { removePositionsFromTileList } from "./calculations";
import { Tile } from "models/Tile";
import { LevelChangeFieldHandler } from ".";
import { Entity } from "models/Entity";

type _PointerDownEvt = React.PointerEvent<HTMLCanvasElement>;
type _PointerMoveEvt = React.PointerEvent<HTMLCanvasElement>;
type _PointerUpEvt = PointerEvent;

const MOUSE_BUTTON_LEFT = 0;
const MOUSE_BUTTON_RIGHT = 1;

/**
 * The pixels contained in a single unit in a Level. This is not affected by any
 * transformations in the canvas, such as zoom.
 */
const PIXELS_PER_UNIT = 16;

export default function useEditorCanvasInteraction (
    pack: ResourcePack,
    level: Level,
    canvas: HTMLCanvasElement | null,
    btnDown: 'left' | 'right' | null,
    /**
     * The position in the level (in grid units) where elements would be placed
     * right now.
     */
    placePosition: Vec2 | null,
    tilesInCurrentStroke: Vec2[],
    onChangeField: LevelChangeFieldHandler,
    setTilesInCurrentStroke: React.Dispatch<React.SetStateAction<Vec2[]>>,
    getTileAtPos: (layerIndex: number, pos: Vec2) => PlacedTile | null,
    windowToLevelPos: (x: number, y: number, allowDecimals: boolean)
        => Vec2 | null,
    canvasToLevelPixelPos: (x: number, y: number) => Vec2 | null,
) {
    const { width, height } = level.settings;

    const levelCtx = useLevelEditorContext();

    return {
        onPointerDown,
        onPointerMove,
        onPointerUp,
    }

    //#region Pointer events
    function onPointerDown (evt: _PointerDownEvt) {
        if (levelCtx.activeSection === 'terrain') {
            handlePointerDownForTerrain(evt);
        }
        else if (levelCtx.activeSection === 'spawns') {
            handlePointerDownForSpawns(evt);
        }
    }

    function onPointerMove (evt: _PointerMoveEvt) {
        if (levelCtx.activeSection === 'terrain') {
            handlePointerMoveForTerrain(evt);
        }
    }

    function onPointerUp (evt: _PointerUpEvt) {
        if (levelCtx.activeSection === 'terrain') {
            handlePointerUpForTerrain(evt);
        }
    }

    function handlePointerDownForTerrain (evt: _PointerDownEvt) {
        const tool = levelCtx.terrainTool;

        // don't use btnDown here, since the button is not already down when
        // you just clicked it.
        if (evt.button === MOUSE_BUTTON_LEFT) {
            if (tool === 'select') {
                selectAtPos(evt.clientX, evt.clientY);
            }
            else if (tool === 'brush' || tool == 'eraser') {
                registerPlaceTileClickAt({
                    x: evt.clientX,
                    y: evt.clientY,
                });
                levelCtx.cancelSelection();
            }
            else if (tool === 'rectangle') {
                levelCtx.cancelSelection();
            }
            else if (tool === 'bucket') {
                fillAreaFrom(evt.clientX, evt.clientY, 'fill');
                levelCtx.cancelSelection();
            }
            else if (tool === 'picker') {
                levelCtx.cancelSelection();
            }
        }
        else if (evt.button === MOUSE_BUTTON_RIGHT) {
            if (tool === 'bucket') {
                fillAreaFrom(evt.clientX, evt.clientY, 'unfill');
            }
        }
    }

    function handlePointerMoveForTerrain (masterEvt: _PointerMoveEvt) {
        const tool = levelCtx.terrainTool;
        const coalescedEvts = masterEvt.nativeEvent.getCoalescedEvents();


        if (btnDown === 'left') {
            if (tool === 'select') {

            }
            if (tool === 'brush' || tool === 'eraser') {
                const newPoints = [] as Vec2[]; // raw click pixel coords.
        
                for (const evt of coalescedEvts) {
                    if (btnDown === 'left') {
                        newPoints.push({
                            x: evt.clientX,
                            y: evt.clientY,
                        });
                    }
                }
                
                registerPlaceTileClickAt(...newPoints);
            }
            else if (tool === 'rectangle') {

            }
            else if (tool === 'bucket') {

            }
            else if (tool === 'picker') {

            }
        }
        else if (btnDown === 'right') {

        }
    }

    function handlePointerUpForTerrain (evt: _PointerUpEvt) {
        if (btnDown === 'left') {
            if (levelCtx.terrainTool === 'brush') {
                addDrawnTiles(tilesInCurrentStroke);
            }
            else if (levelCtx.terrainTool === 'eraser') {
                removeDrawnTiles(tilesInCurrentStroke);
            }
        }
    }

    function handlePointerDownForSpawns (evt: _PointerDownEvt) {
        const tool = levelCtx.terrainTool;

        if (evt.button === MOUSE_BUTTON_LEFT) {
            if (tool === 'select') {
                selectAtPos(evt.clientX, evt.clientY);
            }
            else if (tool === 'brush') {
                if (placePosition !== null && levelCtx.entityPaint !== null) {
                    const spawn = createSpawn(placePosition, levelCtx.entityPaint);
                    addSpawn(spawn);
                }
            }
            else if (tool === 'eraser') {
                if (placePosition !== null) {
                    deleteEntityAt(placePosition);
                    levelCtx.cancelSelection();
                }
            }
        }
    }
    //#endregion

    //#region Selections
    /**
     * Selects whatever it is where the user clicked. The priority of the selection
     * (tiles, spawns, events, etc) depends on the currently selected edit section.
     * @param x 
     * @param y 
     * @returns 
     */
    function selectAtPos (x: number, y: number) {
        levelCtx.cancelSelection();
        
        if (levelCtx.activeSection === 'terrain') {
            const selectedTile = selectTileAtCanvasPos(x, y);
            if (selectedTile) return;
            _regularSelectOrder();
        }
        else if (levelCtx.activeSection === 'spawns') {
            const selectedSpawn = selectEntityAtCanvasPos(x, y);
            if (selectedSpawn) return;
            _regularSelectOrder();
        }
        else {
            _regularSelectOrder();
        }

        // the regular order to select, to be used when an object in the active
        // section hasn't been found.
        function _regularSelectOrder () {
            const selectedSpawn = selectEntityAtCanvasPos(x, y);
            if (selectedSpawn) return;
            const selectedTile = selectTileAtCanvasPos(x, y);
            if (selectedTile) return;
        }
    }
    /**
     * Selects the tile at the canvas position given.
     * @param x The x position in the canvas.
     * @param y The y position in the canvas.
     * @returns True when a selection has been made, false otherwise.
     */
    function selectTileAtCanvasPos (x: number, y: number) : boolean {
        const levelPos = windowToLevelPos(x, y, false);
        if (levelPos === null) return false;

        // if the user clicks in an empty area, cancel the selection.
        if (getTileAtPos(levelCtx.activeTerrainLayer, levelPos) === null) {
            levelCtx.setTileSelection([]);
            return false;
        }

        levelCtx.setTileSelection([levelPos]);
        return true;
    }

    /**
     * Selects the front-most entity at the canvas position given.
     * @param x The x position in the canvas.
     * @param y The y position in the canvas.
     * @returns True when a selection has been made, false otherwise.
     */
    function selectEntityAtCanvasPos (x: number, y: number) : boolean {
        const levelPos = windowToLevelPos(x, y, true);
        if (levelPos === null) return false;
        
        const spawn = getFirstSpawnAt(levelPos);
        if (spawn) {
            levelCtx.setSpawnSelection([spawn.uuid]);
            return true;
        }
        else {
            levelCtx.setSpawnSelection([]);
            return false;
        }
    }
    //#endregion

    // #region brush stroke
    function registerPlaceTileClickAt (...positions : Vec2[]) {
        if (canvas === null) return [];
        if (levelCtx.terrainPaint === null) return;

        setTilesInCurrentStroke(prevState => {
            const placedTiles = [] as Vec2[];

            for (const pixelPos of positions) {
                const tilePos = windowToLevelPos(pixelPos.x, pixelPos.y, false)!;
    
                if (prevState.find(lt => vec2equals(lt, tilePos))) {
                    continue;
                }
                if (placedTiles.find(pt => vec2equals(pt, tilePos))) {
                    continue;
                }
    
                placedTiles.push(tilePos);
            }

            return [
                ...prevState,
                ...placedTiles,
            ];
        });
    }
    //#endregion
    
    /**
     * Fills an area with the selected paint. The origin of this fill is calculated
     * from the point in the canvas given. This is the bucket's functionality.
     * @param x The x position in the canvas.
     * @param y The y position in the canvas.
     */
    function fillAreaFrom (x: number, y: number, fillMode: 'fill' | 'unfill') {
        if (canvas === null) return;
        if (levelCtx.terrainPaint === null) return;

        const origin = windowToLevelPos(x, y, false);
        if (origin === null) return;
        const originTile = getTileAtPos(levelCtx.activeTerrainLayer, origin)?.tileId;

        const placedTiles = [] as Vec2[];
        const fillStack = [origin];

        while (fillStack.length > 0) {
            const pos = fillStack.pop()!;

            // these coordinates are outside the level.
            if (pos.x < 0 || pos.x >= width || pos.y < 0 || pos.y >= height) {
                continue;
            }
            // the tile in this position is different, so we don't spill into it.
            if (getTileAtPos(levelCtx.activeTerrainLayer, pos)?.tileId !== originTile) {
                continue;
            }
            // the tile in this position was already iterated over.
            if (placedTiles.find(pt => vec2equals(pt, pos))) {
                continue;
            }

            placedTiles.push(pos);

            fillStack.push({x: pos.x + 1, y: pos.y});
            fillStack.push({x: pos.x - 1, y: pos.y});
            fillStack.push({x: pos.x, y: pos.y + 1});
            fillStack.push({x: pos.x, y: pos.y - 1});
        }

        // replacing tiles
        if (fillMode === 'fill') {
            addDrawnTiles(placedTiles);
        }
        else if (fillMode === 'unfill') {
            removeDrawnTiles(placedTiles);
        }
    }

    // #region Tile placement and removal
    function addDrawnTiles (tiles: Vec2[]) {
        if (levelCtx.terrainPaint === null) return;

        let layerTiles = removePositionsFromTileList(
            level.layers[levelCtx.activeTerrainLayer].tiles,
            tiles
        );

        const addedPositions = new Set<string>();
        for (const t of tiles) {
            if (addedPositions.has(vec2toString(t))) {
                continue;
            }
            else {
                addedPositions.add(vec2toString(t));
            }

            layerTiles.push(createLevelTile(
                t, levelCtx.terrainPaint.object
            ));
        }

        const update: TileLayer[] = [...level.layers];
        update[levelCtx.activeTerrainLayer] = {
            ...update[levelCtx.activeTerrainLayer],
            tiles: layerTiles
        }

        onChangeField('layers', update);

        setTilesInCurrentStroke([]);
    }

    function removeDrawnTiles (tiles: Vec2[]) {
        let layerTiles = removePositionsFromTileList(
            level.layers[levelCtx.activeTerrainLayer].tiles,
            tiles
        );

        const update: TileLayer[] = [...level.layers];
        update[levelCtx.activeTerrainLayer] = {
            ...update[levelCtx.activeTerrainLayer],
            tiles: layerTiles
        }

        onChangeField('layers', update);

        setTilesInCurrentStroke([]);
    }

    function deleteEntityAt (gridPosition: Vec2) {        
        const spawn = getFirstSpawnAt(gridPosition);
        if (spawn === null) return;
        
        const update = level.spawns.filter(s => s.uuid !== spawn.uuid);
        onChangeField('spawns', update);
    }

    function addSpawn (spawn: LevelSpawn) {
        const spawns = [
            ...level.spawns,
            spawn
        ];

        onChangeField('spawns', spawns);
    }

    function createLevelTile (gridPosition: Vec2, tile: Tile) : PlacedTile {
        return {
            ...getNewLevelTile(tile),
            position: gridPosition,
        };
    }

    function createSpawn (levelPos: Vec2, entity: Entity) : LevelSpawn {
        return {
            uuid: crypto.randomUUID(),
            entity: getNewLevelEntity(entity),
            position: levelPos,
        };
    }
    // #endregion

    /**
     * Returns the front-most entity at the level position given, or null if
     * no entity exists there.
     * @param levelPos The position in the level to look in.
     * @returns 
     */
    function getFirstSpawnAt (levelPos: Vec2) : LevelSpawn | null {
        // loop from end to start so entities on top are given preference in
        // case two entities are at the same place.
        for (let i = level.spawns.length - 1; i >= 0; i--) {
            const spawn = level.spawns[i];
            const entityDef = pack.entitiesById[spawn.entity.entityId];
            if (entityDef === undefined) continue;

            const entityRect = new Rect(
                spawn.position.x,
                spawn.position.y,
                entityDef.data.spritesheet.sliceSize[0] / PIXELS_PER_UNIT,
                entityDef.data.spritesheet.sliceSize[1] / PIXELS_PER_UNIT,
            )

            if (isVec2WithinRect(levelPos, entityRect)) {
                return spawn;
            }
        }

        return null;
    }

    function levelPixelToGridPosition (pixelPosition: Vec2) : Vec2 {
        return {
            x: pixelPosition.x / PIXELS_PER_UNIT,
            y: pixelPosition.y / PIXELS_PER_UNIT,
        }
    }
}