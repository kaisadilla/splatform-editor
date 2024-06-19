export interface CompiledLevel {
    magicBytes: [0xA7, 0xA5, 0x1A, 0x42];
    endianSignature: 0 | 1;
    fileType: number;

    versionMajor: number;
    versionMinor: number;
    versionRevision: number;

    width: number;
    height: number;

    backgroundIndex: number;
    musicIndex: number;

    time: number;

    tileLayerCount: number;
    tileLayers: CompiledLevelTileLayer[];

    spawnCount: number;
    spawns: CompiledLevelSpawn[];
}

export interface CompiledLevelTileLayer {
    checksCollisions: boolean;
    tileCount: number;
    tiles: CompiledLevelPlacedTile[];
}

export interface CompiledLevelPlacedTile {
    xPos: number;
    yPos: number;
    tile: CompiledLevelTile;
}

export interface CompiledLevelTile {
    spriteIndex: number;
    xSliceCount: number;
    ySliceCount: number;
    animationCount: number;
}

export interface CompiledLevelSpawn {

}