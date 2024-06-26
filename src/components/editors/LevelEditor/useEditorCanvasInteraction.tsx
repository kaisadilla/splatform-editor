import { useLevelEditorContext } from "context/useLevelEditorContext";
import { Level, LevelSpawn, PlacedTile, TileLayer, getNewLevelEntity, getNewLevelTile } from "models/Level";
import { DocumentMetadata, ResourcePack } from "models/ResourcePack";
import { Rect, Vec2, isVec2WithinRect, vec2equals, vec2toString } from "utils";
import { removePositionsFromTileList } from "./calculations";
import { Tile } from "models/Tile";
import { LevelChangeFieldHandler } from ".";
import { Entity } from "models/Entity";
import { useState } from "react";
import { RectangleTileComposite, UnitTileComposite } from "models/TileComposite";

type _PointerDownEvt = React.PointerEvent<HTMLCanvasElement>;
type _PointerMoveEvt = React.PointerEvent<HTMLCanvasElement>;
type _PointerUpEvt = PointerEvent;

const MOUSE_BUTTON_LEFT = 0;
const MOUSE_BUTTON_RIGHT = 2;

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
    currentStroke: PlacedTile[],
    currentPosStroke: Vec2[],
    onChangeField: LevelChangeFieldHandler,
    setCurrentStroke: React.Dispatch<React.SetStateAction<PlacedTile[]>>,
    setCurrentPosStroke: React.Dispatch<React.SetStateAction<Vec2[]>>,
    getTileAtPos: (layerIndex: number, pos: Vec2) => PlacedTile | null,
    windowToLevelPos: (x: number, y: number, allowDecimals: boolean)
        => Vec2 | null,
    canvasToLevelPixelPos: (x: number, y: number) => Vec2 | null,
) {
    const { width, height } = level.settings;

    const levelCtx = useLevelEditorContext();

    // when using the rectangle tool, indicates the origin of the rectangle,
    // if a rectangle is currently being drawn.
    const [rectOrigin, setRectOrigin] = useState<Vec2 | null>(null);

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
        // NOTE: Remember to update useEffect dependencies.
        if (levelCtx.activeSection === 'terrain') {
            handlePointerUpForTerrain(evt);
        }
        
        resetStrokes();
    }

    function handlePointerDownForTerrain (evt: _PointerDownEvt) {
        const tool = levelCtx.terrainTool;

        // don't use btnDown here, since the button is not already down when
        // you just clicked it.
        if (evt.button === MOUSE_BUTTON_LEFT) {
            if (tool === 'select') {
                selectAtPos(evt.clientX, evt.clientY);
            }
            else if (tool === 'brush') {
                registerPlaceTileClickAt({
                    x: evt.clientX,
                    y: evt.clientY,
                });
                levelCtx.cancelSelection();
            }
            else if (tool === 'rectangle') {
                startRectangle(evt.clientX, evt.clientY);
                levelCtx.cancelSelection();
            }
            else if (tool === 'eraser') {
                registerRemoveTileClickAt({
                    x: evt.clientX,
                    y: evt.clientY,
                });
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
            if (tool === 'rectangle') {
                startRectangle(evt.clientX, evt.clientY);
                levelCtx.cancelSelection();
            }
            else if (tool === 'bucket') {
                fillAreaFrom(evt.clientX, evt.clientY, 'delete');
                levelCtx.cancelSelection();
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

                if (tool === 'brush') {
                    if (levelCtx.terrainPaint === null) return;

                    if (levelCtx.terrainPaint.type === 'tile') {
                        registerPlaceTileClickAt(...newPoints);
                    }
                }
                else if (tool === 'eraser') {
                    registerRemoveTileClickAt(...newPoints);
                }
            }
            else if (tool === 'rectangle') {
                if (rectOrigin !== null) {
                    updateRectangle(masterEvt.clientX, masterEvt.clientY);
                }
            }
            else if (tool === 'bucket') {

            }
            else if (tool === 'picker') {

            }
        }
        else if (btnDown === 'right') {
            if (tool === 'rectangle') {
                if (rectOrigin !== null) {
                    updateNegativeRectangle(masterEvt.clientX, masterEvt.clientY);
                }
            }
        }
    }

    function handlePointerUpForTerrain (evt: _PointerUpEvt) {
        // NOTE: Remember to update useEffect dependencies.
        if (btnDown === 'left') {
            if (levelCtx.terrainTool === 'brush') {
                addDrawnTiles(currentStroke);
                setCurrentStroke([]);
            }
            else if (levelCtx.terrainTool === 'eraser') {
                removeDrawnTiles(currentPosStroke);
            }
            else if (levelCtx.terrainTool === 'rectangle') {
                endRectangle('fill');
            }
        }
        else if (btnDown === 'right') {
            if (levelCtx.terrainTool === 'rectangle') {
                endRectangle('delete');
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
    function registerPlaceTileClickAt (...winPositions : Vec2[]) {
        addTilesToStroke(...winPositions.map(
            p => windowToLevelPos(p.x, p.y, false)!
        ));
    }

    function registerRemoveTileClickAt (...winPositions: Vec2[]) {
        addTilesToPosStroke(...winPositions.map(
            p => windowToLevelPos(p.x, p.y, false)!
        ));
    }

    function startRectangle (winX: number, winY: number) {
        setRectOrigin(windowToLevelPos(winX, winY, false)!);
    }

    function updateRectangle (winX: number, winY: number) {
        if (levelCtx.terrainPaint === null) return;
        if (rectOrigin === null) return;

        const levelPos = windowToLevelPos(winX, winY, false)!;

        const xMin = Math.min(levelPos.x, rectOrigin.x);
        const xMax = Math.max(levelPos.x, rectOrigin.x);
        const yMin = Math.min(levelPos.y, rectOrigin.y);
        const yMax = Math.max(levelPos.y, rectOrigin.y);

        if (levelCtx.terrainPaint.type === 'tile') {
            const placedTiles = [] as PlacedTile[];

            for (let x = xMin; x <= xMax; x++) {
                for (let y = yMin; y <= yMax; y++) {
                    placedTiles.push(
                        createLevelTile({x, y}, levelCtx.terrainPaint)
                    );
                }
            }

            setCurrentStroke(placedTiles);

            return;
        }

        // tile composite
        if (levelCtx.terrainPaint.compositeType === 'rectangle') {
            const comp = levelCtx.terrainPaint as RectangleTileComposite;

            //if ((xMax - xMin) < comp.minSize[0] - 1 || (yMax - yMin) < comp.minSize[1] - 1) {
            //    setCurrentStroke([]);
            //    return;
            //}

            const defTile = pack.tilesById[comp.tiles.default];
            const topLeft = pack.tilesById[comp.tiles.topLeft!] ?? defTile;
            const top = pack.tilesById[comp.tiles.top!] ?? defTile;
            const topRight = pack.tilesById[comp.tiles.topRight!] ?? defTile;
            const left = pack.tilesById[comp.tiles.left!] ?? defTile;
            const center = pack.tilesById[comp.tiles.center!] ?? defTile;
            const right = pack.tilesById[comp.tiles.right!] ?? defTile;
            const bottomLeft = pack.tilesById[comp.tiles.bottomLeft!] ?? defTile;
            const bottom = pack.tilesById[comp.tiles.bottom!] ?? defTile;
            const bottomRight = pack.tilesById[comp.tiles.bottomRight!] ?? defTile;

            const placedTiles = [] as PlacedTile[];

            let selectedTile: DocumentMetadata<Tile>;
            for (let x = xMin; x <= xMax; x++) {

                for (let y = yMin; y <= yMax; y++) {
                    if (y === yMin) {
                        if (x === xMin) selectedTile = topLeft;
                        else if (x === xMax) selectedTile = topRight;
                        else selectedTile = top;
                    }
                    else if (y === yMax) {
                        if (x === xMin) selectedTile = bottomLeft;
                        else if (x === xMax) selectedTile = bottomRight;
                        else selectedTile = bottom;
                    }
                    else {
                        if (x === xMin) selectedTile = left;
                        else if (x === xMax) selectedTile = right;
                        else selectedTile = center;
                    }

                    placedTiles.push(
                        createLevelTile({x, y}, selectedTile.data)
                    );
                }
            }

            setCurrentStroke(placedTiles);
            return;
        }
    }

    function updateNegativeRectangle (winX: number, winY: number) {
        if (levelCtx.terrainPaint === null) return;
        if (rectOrigin === null) return;

        const levelPos = windowToLevelPos(winX, winY, false)!;

        const xMin = Math.min(levelPos.x, rectOrigin.x);
        const xMax = Math.max(levelPos.x, rectOrigin.x);
        const yMin = Math.min(levelPos.y, rectOrigin.y);
        const yMax = Math.max(levelPos.y, rectOrigin.y);

        if (levelCtx.terrainPaint.type === 'tile') {
            const removedTiles = [] as Vec2[];

            for (let x = xMin; x <= xMax; x++) {
                for (let y = yMin; y <= yMax; y++) {
                    removedTiles.push({x, y});
                }
            }

            setCurrentPosStroke(removedTiles);
        }
    }

    function endRectangle (mode: 'fill' | 'delete') {
        if (mode === 'fill') {
            addDrawnTiles(currentStroke);
            //setCurrentStroke([]);
        }
        else if (mode === 'delete') {
            removeDrawnTiles(currentPosStroke);
            //setCurrentPosStroke([]);
        }
        setRectOrigin(null);
    }

    //#endregion
    
    /**
     * Fills an area with the selected paint. The origin of this fill is calculated
     * from the point in the canvas given. This is the bucket's functionality.
     * @param x The x position in the canvas.
     * @param y The y position in the canvas.
     */
    function fillAreaFrom (x: number, y: number, fillMode: 'fill' | 'delete') {
        if (canvas === null) return;
        if (levelCtx.terrainPaint === null) return;

        const origin = windowToLevelPos(x, y, false);
        if (origin === null) return;
        const originTile = getTileAtPos(levelCtx.activeTerrainLayer, origin)?.tileId;

        const placedTilePos = [] as Vec2[];
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
            if (placedTilePos.find(pt => vec2equals(pt, pos))) {
                continue;
            }

            placedTilePos.push(pos);

            fillStack.push({x: pos.x + 1, y: pos.y});
            fillStack.push({x: pos.x - 1, y: pos.y});
            fillStack.push({x: pos.x, y: pos.y + 1});
            fillStack.push({x: pos.x, y: pos.y - 1});
        }

        // replacing tiles
        if (fillMode === 'fill') {
            if (levelCtx.terrainPaint === null) return;

            if (levelCtx.terrainPaint.type === 'tile') {
                const placedTiles = [];
                for (const pos of placedTilePos) {
                    placedTiles.push({
                        ...getNewLevelTile(levelCtx.terrainPaint as Tile),
                        position: pos,
                    })
                }
                addDrawnTiles(placedTiles);
            }
        }
        else if (fillMode === 'delete') {
            removeDrawnTiles(placedTilePos);
        }
    }

    // #region Tile placement and removal
    function addDrawnTiles (tiles: PlacedTile[]) {
        if (levelCtx.terrainPaint === null) return;

        let layerTiles = removePositionsFromTileList(
            level.layers[levelCtx.activeTerrainLayer].tiles,
            tiles.map(t => t.position)
        );

        const addedPositions = new Set<string>();
        for (const t of tiles) {
            if (addedPositions.has(vec2toString(t.position))) {
                continue;
            }
            else {
                addedPositions.add(vec2toString(t.position));
            }

            layerTiles.push(t);
        }

        const update: TileLayer[] = [...level.layers];
        update[levelCtx.activeTerrainLayer] = {
            ...update[levelCtx.activeTerrainLayer],
            tiles: layerTiles
        }

        onChangeField('layers', update);
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

    // #region Interaction state management
    /**
     * Adds the positions given to the current stroke, modifying it as needed
     * in case a tile composite is used as paint.
     * @param positions The position(s) to add to the stroke.
     */
    function addTilesToStroke (...positions: Vec2[]) {
        setCurrentStroke(prevState => {
            if (levelCtx.terrainPaint === null) return prevState;

            if (levelCtx.terrainPaint.type === 'tile') {
                const placedTiles = [] as PlacedTile[];
    
                for (const pos of positions) {
                    // position of tiles already in the current stroke
                    if (prevState.find(lt => vec2equals(lt.position, pos))) {
                        continue;
                    }
                    // position of tiles that will be added this frame
                    if (placedTiles.find(pt => vec2equals(pt.position, pos))) {
                        continue;
                    }
    
                    placedTiles.push(createLevelTile(pos, levelCtx.terrainPaint));
                }

                return [
                    ...prevState,
                    ...placedTiles,
                ]
            }
            if (levelCtx.terrainPaint.compositeType === 'unit') {
                const unitComp = levelCtx.terrainPaint as UnitTileComposite;
                const placedTiles = [] as PlacedTile[];
                const pos = positions[positions.length - 1];

                // position of tiles already in the current stroke
                if (prevState.find(lt => vec2equals(lt.position, pos))) {
                    return prevState;
                }
                // position of tiles that will be added this frame
                if (placedTiles.find(pt => vec2equals(pt.position, pos))) {
                    return prevState;
                }

                for (let y = 0; y < unitComp.shape.length; y++) {
                    for (let x = 0; x < unitComp.shape[y].length; x++) {
                        const tileId = unitComp.shape[y][x];
                        if (!tileId) continue;

                        const tile = pack.tilesById[tileId];
                        if (!tile) continue;

                        placedTiles.push(createLevelTile(
                            {x: pos.x + x, y: pos.y + y},
                            tile.data
                        ));
                    }
                }

                return [
                    ...prevState,
                    ...placedTiles,
                ]
            }

            return prevState;
        });
    }

    /**
     * Adds the given positions to the current position stroke.
     * @param positions The position(s) to add to the stroke.
     */
    function addTilesToPosStroke (...positions: Vec2[]) {
        setCurrentPosStroke(prevState => {
            const addedPositions = [] as Vec2[];

            for (const pos of positions) {
                // position of tiles already in the current stroke
                if (prevState.find(lt => vec2equals(lt, pos))) {
                    continue;
                }
                // position of tiles that will be added this frame
                if (addedPositions.find(pt => vec2equals(pt, pos))) {
                    continue;
                }

                addedPositions.push(pos);
            }

            return [
                ...prevState,
                ...addedPositions,
            ]
        });
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

            const sliceSize = entityDef.data.spritesheet.sliceSize ?? [16, 16];

            const entityRect = new Rect(
                spawn.position.x,
                spawn.position.y,
                sliceSize[0] / PIXELS_PER_UNIT,
                sliceSize[1] / PIXELS_PER_UNIT,
            )

            if (isVec2WithinRect(levelPos, entityRect)) {
                return spawn;
            }
        }

        return null;
    }

    /**
     * Empties all stroke arrays.
     */
    function resetStrokes () {
        setCurrentStroke([]);
        setCurrentPosStroke([]);
    }

    function levelPixelToGridPosition (pixelPosition: Vec2) : Vec2 {
        return {
            x: pixelPosition.x / PIXELS_PER_UNIT,
            y: pixelPosition.y / PIXELS_PER_UNIT,
        }
    }
}