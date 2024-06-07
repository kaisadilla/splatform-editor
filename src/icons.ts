import levelIcon from "@assets/icons/level-file.png";
import worldIcon from "@assets/icons/world-file.png";
import gameIcon from "@assets/icons/game-file.png";
import manifestIcon from "@assets/icons/manifest-file.png";
import entityIcon from "@assets/icons/entity-file.png";
import tileIcon from "@assets/icons/tile-file.png";

export const FileIcons = {
    level: levelIcon,
    world: worldIcon,
    game: gameIcon,
    manifest: manifestIcon,
    entity: entityIcon,
    tile: tileIcon,
};

export interface ImageIconCollection {
    grid: string;
    image: string;
    json: string;
    play: string;
    playGreen: string;
    save: string;
    saveAll: string;
    saveAs: string;
}

export const ToolIcons1x: ImageIconCollection = {
    grid: require("@assets/icons/grid.20.png"),
    image: require("@assets/icons/image.20.png"),
    json: require("@assets/icons/json.png"),
    play: require("@assets/icons/play.20.png"),
    playGreen: require("@assets/icons/play-green.png"),
    save: require("@assets/icons/save.20.png"),
    saveAll: require("@assets/icons/save-all.20.png"),
    saveAs: require("@assets/icons/save-as.20.png"),
}

export const ToolIcons1_5x: ImageIconCollection = {
    grid: require("@assets/icons/grid.30.png"),
    image: require("@assets/icons/image.30.png"),
    json: require("@assets/icons/json.png"),
    play: require("@assets/icons/play.30.png"),
    playGreen: require("@assets/icons/play-green.png"),
    save: require("@assets/icons/save.30.png"),
    saveAll: require("@assets/icons/save-all.30.png"),
    saveAs: require("@assets/icons/save-as.30.png"),
}

export const ToolIcons2x: ImageIconCollection = {
    grid: require("@assets/icons/grid.40.png"),
    image: require("@assets/icons/image.40.png"),
    json: require("@assets/icons/json.png"),
    play: require("@assets/icons/play.40.png"),
    playGreen: require("@assets/icons/play-green.png"),
    save: require("@assets/icons/save.40.png"),
    saveAll: require("@assets/icons/save-all.40.png"),
    saveAs: require("@assets/icons/save-as.40.png"),
}


export const ToolIconsBig: ImageIconCollection = {
    grid: require("@assets/icons/grid.png"),
    image: require("@assets/icons/image.png"),
    json: require("@assets/icons/json.png"),
    play: require("@assets/icons/play.png"),
    playGreen: require("@assets/icons/play-green.png"),
    save: require("@assets/icons/save.png"),
    saveAll: require("@assets/icons/save-all.png"),
    saveAs: require("@assets/icons/save-as.png"),
}
