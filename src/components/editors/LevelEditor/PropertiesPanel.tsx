import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NumberInput, Select, Tabs, TextInput } from '@mantine/core';
import ParameterForm from 'components/ParameterForm';
import ArtificialMoveTraitForm from 'components/trait-forms/entity/ArtificialMoveTraitForm';
import HurtPlayerTraitForm from 'components/trait-forms/entity/HurtPlayerTraitForm';
import { useAppContext } from 'context/useAppContext';
import { PropertiesPanel, useLevelEditorContext } from 'context/useLevelEditorContext';
import { ArtificialMoveEntityValueCollection, EntityValueCollection, HurtPlayerEntityValueCollection, KillableEntityValueCollection } from 'data/EntityTraits';
import { TraitParameterCollection } from 'data/TileTraits';
import { EntityTraitId, TileTraitId } from 'data/Traits';
import BackgroundAssetInput from 'elements/BackgroundAssetInput';
import MusicAssetInput from 'elements/MusicAssetInput';
import SelectGallery from 'elements/SelectGallery';
import { Entity } from 'models/Entity';
import { Level, LevelSettings, LevelSpawn, PlacedTile } from 'models/Level';
import { ParameterValueCollection, TraitSpecification } from 'models/splatform';
import { clampNumber, vec2equals, vec2toString } from 'utils';
import { LevelChangeFieldHandler, LevelChangeSpawnHandler, LevelChangeTileHandler } from '.';
import KillableTraitForm from 'components/trait-forms/entity/KillableTraitForm';

const MIN_DIMENSION_VAL = 10;
const MAX_DIMENSION_VAL = 100_000;

export interface LevelEditor_PropertiesPanelProps {
    level: Level;
    onChange: (update: Level) => void;
    onChangeField: LevelChangeFieldHandler;
    onChangeResourcePack: (val: string | null) => void;
    onChangeTile: LevelChangeTileHandler;
    onChangeSpawn: LevelChangeSpawnHandler;
}

function LevelEditor_PropertiesPanel ({
    level,
    onChange,
    onChangeField,
    onChangeResourcePack,
    onChangeTile,
    onChangeSpawn,
}: LevelEditor_PropertiesPanelProps) {
    const levelCtx = useLevelEditorContext();

    return (
        <div className="level-properties-panel">
            <Tabs
                value={levelCtx.activePropertiesPanel}
                onChange={a => {
                    if (a) {
                        levelCtx.setActivePropertiesPanel(a as PropertiesPanel);
                    }
                }}
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
                        onChangeSpawn={onChangeSpawn}
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
    onChangeSpawn: LevelChangeSpawnHandler;
}

function _ItemProperties ({
    level,
    onChangeField,
    onChangeTile,
    onChangeSpawn,
}: _ItemPropertiesProps) {
    const levelCtx = useLevelEditorContext();

    if (levelCtx.activeSection === 'terrain') {
        return <_TileProperties level={level} onChangeTile={onChangeTile} />;
    }
    else if (levelCtx.activeSection === 'spawns') {
        return <_SpawnProperties level={level} onChangeSpawn={onChangeSpawn} />
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
            <div className="title">
                {tile.data.name} at {vec2toString(levelTile.position)}
            </div>
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
    onChangeSpawn: LevelChangeSpawnHandler;
}

function _SpawnProperties ({
    level,
    onChangeSpawn,
}: _SpawnPropertiesProps) {
    const levelCtx = useLevelEditorContext();

    if (levelCtx.resourcePack === null) return <></>;
    if (levelCtx.spawnSelection.length === 0) return <></>;
    if (levelCtx.spawnSelection.length > 1) return (
        <div>
            Multiple spawn edition is not supported yet.
        </div>
    );

    const spawnId = levelCtx.spawnSelection[0];
    const spawn = level.spawns.find(s => s.uuid === spawnId);
    if (!spawn) {
        console.error(
            `Couldn't find spawn with id ${spawnId} even though it's selected.`
        );
        return <></>;
    }

    const entityDef = levelCtx.resourcePack.entitiesById[spawn.entity.entityId];
    if (!entityDef) {
        console.error(
            `Couldn't find entity with id '${spawn.entity.entityId}'`
        );
        return <></>;
    }

    return (
        <div className="item-properties">
            <_LevelSpawnSettings
                spawn={spawn}
                entityDef={entityDef.data}
                onChangeSpawn={onChangeSpawn}
            />
            {entityDef.data.traits.map(t => <_LevelSpawnTrait
                key={t.id}
                spawn={spawn}
                entityDef={entityDef.data}
                trait={t}
                onChangeSpawn={onChangeSpawn}
            />)}
        </div>
    );
}

interface _LevelSpawnSettingsProps {
    spawn: LevelSpawn;
    entityDef: Entity;
    onChangeSpawn: LevelChangeSpawnHandler;
}

function _LevelSpawnSettings ({
    spawn,
    entityDef,
    onChangeSpawn
}: _LevelSpawnSettingsProps) {
    return (
        <div className="trait-form">
            <div className="parameter-list">
                <div className="parameter-container">
                    <SelectGallery<'left' | 'right'>
                        size='sm'
                        label="Orientation"
                        description="The direction this entity starts looking at."
                        data={[
                            { value: "left", label: "Left" },
                            { value: "right", label: "Right" },
                        ]}
                        value={spawn.entity.orientation}
                        onSelectValue={handleOrientationChange}
                    />
                </div>
            </div>
        </div>
    );

    function handleOrientationChange (val: string | null) {
        if (val === null) return;
        if (val !== "left" && val !== "right") return;

        onChangeSpawn(spawn.uuid, {
            ...spawn,
            entity: {
                ...spawn.entity,
                orientation: val,
            },
        });
    }
}

interface _LevelSpawnTraitProps {
    spawn: LevelSpawn;
    entityDef: Entity;
    trait: TraitSpecification<EntityTraitId>;
    onChangeSpawn: LevelChangeSpawnHandler;
}

function _LevelSpawnTrait ({
    spawn,
    entityDef,
    trait,
    onChangeSpawn,
}: _LevelSpawnTraitProps) {
    const configValues = spawn.entity.parameters[trait.id] ?? {};
    const defaultValues = entityDef.traits.find(t => t.id === trait.id);

    if (!defaultValues) {
        console.error(`Couldn't find default values for trait '${trait.id}'`);
        return <></>;
    }

    const values: ParameterValueCollection = {
        ...defaultValues.parameters,
        ...configValues,
    }

    if (trait.id === 'artificialMove') {
        return <ArtificialMoveTraitForm
            values={values as ArtificialMoveEntityValueCollection}
            onChangeValue={handleParameterValueChange<ArtificialMoveEntityValueCollection>}
        />
    }
    else if (trait.id === 'hurtPlayer') {
        return <HurtPlayerTraitForm
            values={values as HurtPlayerEntityValueCollection}
            onChangeValue={handleParameterValueChange}
        />
    }
    else if (trait.id === 'killable') {
        return <KillableTraitForm
            values={values as KillableEntityValueCollection}
            onChangeValue={handleParameterValueChange}
        />
    }

    return (
        <div>
            {trait.id}
        </div>
    );

    /**
     * Modifies a single parameter for the trait and updates the level with it.
     * T is the type of valuecollection corresponding to this trait.
     * @param paramName The name of the parameter to modify.
     * @param value The value to assign to that parameter.
     */
    function handleParameterValueChange<T extends EntityValueCollection> (
        paramName: keyof T, value: T[keyof T]
    ) {
        const update = {
            ...spawn,
            entity: {
                ...spawn.entity,
                parameters: {
                    ...spawn.entity.parameters,
                    [trait.id]: {
                        ...spawn.entity.parameters[trait.id],
                        [paramName]: value,
                    }
                }
            }
        };

        onChangeSpawn(spawn.uuid, update);
    }
}


export default LevelEditor_PropertiesPanel;
