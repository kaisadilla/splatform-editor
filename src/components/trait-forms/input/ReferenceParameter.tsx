import TileOrEntityInput from "elements/TileOrEntityInput";
import TitledCheckbox from "elements/TitledCheckbox";
import { ResourcePack } from "models/ResourcePack";
import { Parameter, Reference } from "models/splatform";

export interface ReferenceParameterProps {    
    pack: ResourcePack;
    param: Parameter<Reference | null>;
    allowTiles?: Boolean;
    allowTileEntities?: boolean;
    allowEntities?: boolean;
    value: Reference | null;
    onChange?: (v: Reference) => void;
}

function ReferenceParameter ({
    pack,
    param,
    allowTiles = false,
    allowTileEntities = false,
    allowEntities = false,
    value,
    onChange,
}: ReferenceParameterProps) {
    if (!allowTiles && !allowTileEntities && !allowEntities) {
        throw `Must allow something to select.`;
    }

    return (
        <div className="parameter-container parameter-container-boolean">
            <TileOrEntityInput
                pack={pack}
                label={param.displayName}
                description={param.description}
                allowTiles={allowTiles}
                allowTileEntities={allowTileEntities}
                allowEntities={allowEntities}
                value={value}
                onChangeValue={handleChange}
            />
        </div>
    );

    function handleChange (v: Reference) {
        onChange?.(v);
    }
}

export default ReferenceParameter;
