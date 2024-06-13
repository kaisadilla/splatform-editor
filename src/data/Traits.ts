import { Parameter, Trait } from "models/splatform";
import { EntityTraitCollection } from "./EntityTraits";
import { TileTraitCollection } from "./TileTraits";


export type TileTraitId = keyof TileTraitCollection;
export type EntityTraitId = keyof EntityTraitCollection;
export type TraitId = TileTraitId | EntityTraitId;

export type TraitWithId<K, T> = {id: K} & Trait<T>;

export type TraitCollectionOf<T> = {
    [K in keyof T]: Parameter<T[K]>;
}