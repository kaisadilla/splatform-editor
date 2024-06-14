import TileOrEntityInput from "elements/TileOrEntityInput";
import TitledCheckbox from "elements/TitledCheckbox";
import { ResourcePack } from "models/ResourcePack";
import { Parameter, Reference } from "models/splatform";
import { getClassString } from "utils";

export interface ReferenceParameterProps {    
    pack: ResourcePack;
    param: Parameter<Reference | null>;
    allowTiles?: Boolean;
    allowTileEntities?: boolean;
    allowEntities?: boolean;
    value: Reference | null;
    disabled?: boolean;
    onChange?: (v: Reference) => void;
}

function ReferenceParameter ({
    pack,
    param,
    allowTiles = false,
    allowTileEntities = false,
    allowEntities = false,
    value,
    disabled,
    onChange,
}: ReferenceParameterProps) {
    if (!allowTiles && !allowTileEntities && !allowEntities) {
        throw `Must allow something to select.`;
    }
    const className = getClassString(
        "parameter-container",
        "parameter-container-reference",
        disabled && "disabled",
    );

    return (
        <div className={className}>
            <TileOrEntityInput
                pack={pack}
                label={param.displayName}
                description={param.description}
                allowTiles={allowTiles}
                allowTileEntities={allowTileEntities}
                allowEntities={allowEntities}
                value={value}
                disabled={disabled}
                onChangeValue={handleChange}
            />
        </div>
    );

    function handleChange (v: Reference) {
        onChange?.(v);
    }
}

export default ReferenceParameter;
