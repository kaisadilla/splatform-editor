import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NumberInput, Select, Tabs, TextInput } from '@mantine/core';
import ParameterForm from 'components/ParameterForm';
import ArtificialMoveTraitForm from 'components/trait-forms/entity/ArtificialMoveTraitForm';
import HurtPlayerTraitForm from 'components/trait-forms/entity/HurtPlayerTraitForm';
import { useAppContext } from 'context/useAppContext';
import { PropertiesPanel, useLevelEditorContext } from 'context/useLevelEditorContext';
import { ArtificialMoveEntityValueCollection, EntityTraitCollection, EntityValueCollection, HurtPlayerEntityValueCollection, KillableEntityValueCollection, MoveAndFireEntityValueCollection, PowerUpEntityValueCollection, TurnIntoShellEntityValueCollection, WalkEntityValueCollection } from 'data/EntityTraits';
import { EntityTraitId, TileTraitId } from 'data/Traits';
import BackgroundAssetInput from 'elements/BackgroundAssetInput';
import MusicAssetInput from 'elements/MusicAssetInput';
import SelectGallery from 'elements/SelectGallery';
import { Entity } from 'models/Entity';
import { Level, LevelSettings, LevelSpawn, LevelTile, PlacedTile } from 'models/Level';
import { ParameterValueCollection, TraitSpecification } from 'models/splatform';
import { Vec2, clampNumber, vec2equals, vec2toString } from 'utils';
import { LevelChangeFieldHandler, LevelChangeSpawnHandler, LevelChangeTileHandler } from '.';
import KillableTraitForm from 'components/trait-forms/entity/KillableTraitForm';
import MoveAndFireTraitForm from 'components/trait-forms/entity/MoveAndFireTraitForm';
import TurnIntoShellTraitForm from 'components/trait-forms/entity/TurnIntoShellTraitForm';
import WalkTraitForm from 'components/trait-forms/entity/WalkTraitForm';
import PowerUpTraitForm from 'components/trait-forms/entity/PowerUpTraitForm';
import { Tile } from 'models/Tile';
import { BackgroundTileValueCollection, BlockTileValueCollection, BreakableTileValueCollection, TileValueCollection } from 'data/TileTraits';
import BlockTraitForm from 'components/trait-forms/tile/BlockTraitForm';
import BackgroundTraitForm from 'components/trait-forms/tile/BackgroundTraitForm';
import BreakableTraitForm from 'components/trait-forms/tile/BreakableTraitForm';

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

    if (levelCtx.tileSelection.length > 0) {
        return <_TileProperties level={level} onChangeTile={onChangeTile} />;
    }
    else if (levelCtx.spawnSelection.length > 0) {
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
    const levelCtx = useLevelEditorContext();

    // Under certain conditions, this panel is not rendered.
    if (levelCtx.resourcePack === null) return <></>;
    if (levelCtx.tileSelection.length === 0) return <></>;
    if (levelCtx.tileSelection.length > 1) return (
        <div>
            <span>Multiple tile edition is not supported yet.</span>
        </div>
    );
    
    // get the tile in the level currently selected.
    const tilePos = levelCtx.tileSelection[0];
    const levelTile = level.layers[levelCtx.activeTerrainLayer].tiles.find(
        t => vec2equals(t.position, tilePos)
    );
    if (levelTile === undefined) {
        console.error(
            `Couldn't find level tile at ${tilePos}, even though it's selected.`
        );
        return <></>;
    }

    const tileDef = levelCtx.resourcePack.tiles.find(t => t.id === levelTile.tileId);
    if (tileDef === undefined) {
        console.error(
            `Resource pack doesn't contain tile '${levelTile.tileId}'.`
        );
        return <></>;
    }

    return (
        <div className="item-properties">
            <div className="title">
                {tileDef.data.name} at {vec2toString(levelTile.position)}
            </div>
            {tileDef.data.traits.map(t => <_LevelTileTrait
                key={t.id}
                levelTile={levelTile}
                tilePos={tilePos}
                tileDef={tileDef.data}
                trait={t}
                onChangeTile={onChangeTile}
            />)}
        </div>
    )
}

interface _LevelTileTraitProps {
    levelTile: PlacedTile;
    tilePos: Vec2;
    tileDef: Tile;
    trait: TraitSpecification<TileTraitId>;
    onChangeTile: LevelChangeTileHandler;
}

function _LevelTileTrait ({
    levelTile,
    tilePos,
    tileDef,
    trait,
    onChangeTile,
}: _LevelTileTraitProps) {
    const levelCtx = useLevelEditorContext();
    // if there's no configurable parameters, no component is rendered.
    //if (!trait.configurableParameters || trait.configurableParameters.length === 0) {
    //    return <></>;
    //}

    const configValues = levelTile.parameters[trait.id] ?? {};
    const defaultValues = tileDef.traits.find(t => t.id === trait.id);

    if (!defaultValues) {
        console.error(`Couldn't find default values for trait '${trait.id}'`);
        return <></>;
    }

    const values: ParameterValueCollection = {
        ...defaultValues.parameters,
        ...configValues,
    }

    if (trait.id === 'block') {
        return <BlockTraitForm
            configurableParameters={trait.configurableParameters}
            values={values as BlockTileValueCollection}
            onChangeValue={handleParameterValueChange<BlockTileValueCollection>}
        />
    }
    else if (trait.id === 'background') {
        return <BackgroundTraitForm
            configurableParameters={trait.configurableParameters}
            values={values as BackgroundTileValueCollection}
            onChangeValue={handleParameterValueChange<BackgroundTileValueCollection>}
        />
    }
    else if (trait.id === 'breakable') {
        return <BreakableTraitForm
            configurableParameters={trait.configurableParameters}
            values={values as BreakableTileValueCollection}
            onChangeValue={handleParameterValueChange<BreakableTileValueCollection>}
            onChangeMultipleValues={handleTraitValueChange}
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
    function handleParameterValueChange<T extends TileValueCollection> (
        paramName: keyof T, value: T[keyof T]
    ) {
        const update = {
            ...levelTile.parameters,
            [trait.id]: {
                ...levelTile.parameters[trait.id],
                [paramName]: value,
            },
        };

        onChangeTile(levelCtx.activeTerrainLayer, tilePos, 'parameters', update);
    }

    function handleTraitValueChange (value: TileValueCollection) {
        const update = {
            ...levelTile.parameters,
            [trait.id]: value,
        };

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
            `Resource pack doesn't contain entity '${spawn.entity.entityId}'`
        );
        return <></>;
    }

    return (
        <div className="item-properties">
            <div className="title">
                {entityDef.data.name} at {vec2toString(spawn.position)}
            </div>
            <div className="trait-form">
                <div className="header">Spawn parameters</div>
                <_LevelSpawnSettings
                    spawn={spawn}
                    entityDef={entityDef.data}
                    onChangeSpawn={onChangeSpawn}
                />
            </div>
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
                        stretch
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
    // if there's no configurable parameters, no component is rendered.
    if (!trait.configurableParameters || trait.configurableParameters.length === 0) {
        return <></>;
    }

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
            configurableParameters={trait.configurableParameters}
            values={values as ArtificialMoveEntityValueCollection}
            onChangeValue={handleParameterValueChange<ArtificialMoveEntityValueCollection>}
        />
    }
    else if (trait.id === 'hurtPlayer') {
        return <HurtPlayerTraitForm
            configurableParameters={trait.configurableParameters}
            values={values as HurtPlayerEntityValueCollection}
            onChangeValue={handleParameterValueChange}
        />
    }
    else if (trait.id === 'killable') {
        return <KillableTraitForm
            configurableParameters={trait.configurableParameters}
            values={values as KillableEntityValueCollection}
            onChangeValue={handleParameterValueChange}
        />
    }
    else if (trait.id === 'moveAndFire') {
        return <MoveAndFireTraitForm
            configurableParameters={trait.configurableParameters}
            values={values as MoveAndFireEntityValueCollection}
            onChangeValue={handleParameterValueChange}
        />
    }
    else if (trait.id === 'powerUp') {
        return <PowerUpTraitForm
            configurableParameters={trait.configurableParameters}
            values={values as PowerUpEntityValueCollection}
            onChangeValue={handleParameterValueChange}
        />
    }
    else if (trait.id === 'turnIntoShell') {
        return <TurnIntoShellTraitForm
            configurableParameters={trait.configurableParameters}
            values={values as TurnIntoShellEntityValueCollection}
            onChangeValue={handleParameterValueChange}
            onChangeMultipleValues={handleTraitValueChange}
        />
    }
    else if (trait.id === 'walk') {
        return <WalkTraitForm
            configurableParameters={trait.configurableParameters}
            values={values as WalkEntityValueCollection}
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

    function handleTraitValueChange (value: EntityValueCollection) {
        const update = {
            ...spawn,
            entity: {
                ...spawn.entity,
                parameters: {
                    ...spawn.entity.parameters,
                    [trait.id]: value
                }
            }
        };

        onChangeSpawn(spawn.uuid, update);
    }
}


export default LevelEditor_PropertiesPanel;
