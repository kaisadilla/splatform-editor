import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Accordion, NumberInput, Select, Tabs, TextInput } from '@mantine/core';
import ParameterForm from 'components/ParameterForm';
import { useAppContext } from 'context/useAppContext';
import { useLevelEditorContext } from 'context/useLevelEditorContext';
import { TileTraitId, TraitParameterCollection } from 'data/TileTraits';
import BackgroundAssetInput from 'elements/BackgroundAssetInput';
import MusicAssetInput from 'elements/MusicAssetInput';
import { Level, LevelSettings, PlacedTile } from 'models/Level';
import { clampNumber, vec2equals, vec2toString } from 'utils';
import { LevelChangeFieldHandler, LevelChangeTileHandler } from '.';

const MIN_DIMENSION_VAL = 10;
const MAX_DIMENSION_VAL = 100_000;

export interface LevelEditor_PropertiesPanelProps {
    level: Level;
    onChange: (update: Level) => void;
    onChangeField: LevelChangeFieldHandler;
    onChangeResourcePack: (val: string | null) => void;
    onChangeTile: LevelChangeTileHandler;
}

function LevelEditor_PropertiesPanel ({
    level,
    onChange,
    onChangeField,
    onChangeResourcePack,
    onChangeTile,
}: LevelEditor_PropertiesPanelProps) {
    const levelCtx = useLevelEditorContext();

    return (
        <div className="level-properties-panel">
            <Tabs
                defaultValue="level"
                classNames={{
                    root: "sp-section-tab-root",
                    list: "sp-section-tab-ribbon-list",
                    tab: "sp-section-tab-ribbon-tab",
                    tabLabel: "sp-section-tab-ribbon-tab-label",
                    panel: "sp-section-tab-panel",
                }}
            >
                <Tabs.List>
                    <Tabs.Tab value="level">Level properties</Tabs.Tab>
                    <Tabs.Tab value="item">Item properties</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="level">
                    <_LevelProperties
                        level={level}
                        onChange={onChange}
                        onChangeField={onChangeField}
                        onChangeResourcePack={onChangeResourcePack}
                    />
                </Tabs.Panel>
                <Tabs.Panel value="item">
                    <_ItemProperties
                        level={level}
                        onChangeField={onChangeField}
                        onChangeTile={onChangeTile}
                    />
                </Tabs.Panel>
            </Tabs>
        </div>
    );
}

interface _LevelPropertiesProps {
    level: Level;
    onChange: (update: Level) => void;
    onChangeField: LevelChangeFieldHandler;
    onChangeResourcePack: (val: string | null) => void;
}

function _LevelProperties ({
    level,
    onChange,
    onChangeField,
    onChangeResourcePack,
}: _LevelPropertiesProps) {
    const { resourcePacks } = useAppContext();
    const resourcePacksData = [];

    for (const pack of resourcePacks) {
        resourcePacksData.push({
            value: pack.folderName,
            label: pack.manifest.displayName,
        })
    }

    return (
        <div className="level-properties-level-section">
            <Select
                size='sm'
                label="Resource pack"
                placeholder="Select a pack"
                data={resourcePacksData}
                value={level.resourcePack}
                onChange={v => onChangeResourcePack(v)}
                allowDeselect={false}
                rightSection={<FontAwesomeIcon icon='chevron-down' />}
            />
            <TextInput
                size='sm'
                label="Name"
                value={level.displayName}
                onChange={evt => onChangeField(
                    'displayName', evt.currentTarget.value
                )}
            />
            <NumberInput
                size='sm'
                label="Width"
                value={level.settings.width}
                //min={MIN_DIMENSION_VAL}
                max={MAX_DIMENSION_VAL}
                allowDecimal={false}
                allowNegative={false}
                onChange={handleWidthChange}
            />
            <NumberInput
                size='sm'
                label="Height"
                value={level.settings.height}
                //min={MIN_DIMENSION_VAL}
                max={MAX_DIMENSION_VAL}
                allowDecimal={false}
                allowNegative={false}
                onChange={handleHeightChange}
            />
            <BackgroundAssetInput
                label="Background"
                pack={level.resourcePack}
                value={level.settings.background}
                onSelectValue={v => handleSettingsValue('background', v)}
            />
            <MusicAssetInput
                label="Music"
                pack={level.resourcePack}
                value={level.settings.music}
                onSelectValue={v => handleSettingsValue('music', v)}
            />
            <NumberInput
                size='sm'
                label="Time"
                value={level.settings.time}
                min={1}
                allowNegative={false}
                stepHoldDelay={300}
                stepHoldInterval={20}
                onChange={handleTimeChange}
            />
        </div>
    );

    function handleSettingsValue (field: keyof LevelSettings, value: any) {
        onChangeField('settings', {
            ...level.settings,
            [field]: value,
        });
    }

    function handleWidthChange (value: any) {
        if (typeof value !== 'number') return;

        value = clampNumber(value, MIN_DIMENSION_VAL, MAX_DIMENSION_VAL);
        handleSettingsValue('width', value);
    }

    function handleHeightChange (value: any) {
        if (typeof value !== 'number') return;

        value = clampNumber(value, MIN_DIMENSION_VAL, MAX_DIMENSION_VAL);
        handleSettingsValue('height', value);
    }

    function handleTimeChange (value: any) {
        if (typeof value !== 'number') return;

        value = Math.max(value, 1);
        handleSettingsValue('time', value);
    }
}

interface _ItemPropertiesProps {
    level: Level;
    onChangeField: LevelChangeFieldHandler;
    onChangeTile: LevelChangeTileHandler;
}

function _ItemProperties ({
    level,
    onChangeField,
    onChangeTile,
}: _ItemPropertiesProps) {
    const levelCtx = useLevelEditorContext();

    if (levelCtx.activeSection === 'terrain') {
        return <_TileProperties level={level} onChangeTile={onChangeTile} />
    }
    else if (levelCtx.activeSection === 'spawns') {
        return <_SpawnProperties level={level} onChangeField={onChangeField} />
    }

    return <></>;
}


interface _TilePropertiesProps {
    level: Level;
    onChangeTile: LevelChangeTileHandler;
}

/**
 * The element that renders the entire "tile properties" section.
 * @returns 
 */
function _TileProperties ({
    level,
    onChangeTile,
}: _TilePropertiesProps) {
    const { getResourcePack } = useAppContext();
    const levelCtx = useLevelEditorContext();

    // if no tile is selected, this panel is not rendered.
    if (levelCtx.tileSelection.length === 0) return <></>;

    // when multiple tiles are selected, we can't edit their info yet.
    // TODO: Show only traits all targets have in common.
    if (levelCtx.tileSelection.length > 1) return (
        <div>
            <span>Multiple tile edition is not supported yet.</span>
        </div>
    );

    const pack = getResourcePack(level.resourcePack);
    if (pack === null) return (
        <div>
            <span>Select a valid resource pack to access properties.</span>
        </div>
    );
    
    // get the tile in the level currently selected.
    const tilePos = levelCtx.tileSelection[0];
    const levelTile = level.layers[levelCtx.activeTerrainLayer].tiles.find(
        t => vec2equals(t.position, tilePos)
    );
    // it should always find a tile, since selection is restricted to existing
    // tiles. If it doesn't, that's an error.
    if (levelTile === undefined) {
        console.error(
            `Couldn't find level tile at ${tilePos}, even though it's selected.`
        );
        return <></>;
    }

    // the tile info in the resource pack.
    const tile = pack.tiles.find(t => t.id === levelTile.tileId);
    if (tile === undefined) {
        console.error(
            `Resource pack doesn't contain tile '${levelTile.tileId}'.`
        );
        return <></>;
    }
    
    // each item has a key to ensure all nodes update when changing between
    // tiles of the same type
    return (
        <div className="item-properties">
            <ParameterForm
                pack={pack}
                traits={tile.data.traits}
                traitValues={levelTile.parameters}
                onChangeTraitValues={
                    (traitId, v) => handleTraitParamsChange(
                        levelTile, traitId, v
                    )
                }
            />
        </div>
    );

    function handleTraitParamsChange (
        levelTile: PlacedTile,
        traitId: TileTraitId,
        value: TraitParameterCollection
    ) {
        const update = {...levelTile.parameters};
        update[traitId] = value;

       onChangeTile(levelCtx.activeTerrainLayer, tilePos, 'parameters', update);
    }
}

interface _SpawnPropertiesProps {
    level: Level;
    onChangeField: LevelChangeFieldHandler;
}

function _SpawnProperties ({
    level,
    onChangeField,
}: _SpawnPropertiesProps) {

    return (
        <div>
            
        </div>
    );
}


export default LevelEditor_PropertiesPanel;
