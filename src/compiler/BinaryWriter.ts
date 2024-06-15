import { clampNumber } from "utils";

type _BinaryArray =
    Int8Array
    | Uint8Array
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | BigInt64Array
    | BigUint64Array
    | Float32Array
    | Float64Array
;

export class BinaryWriter {
    private bytes: number[];
    //private view: DataView;
    private offset: number;

    constructor () {
        this.bytes = [];
        this.offset = 0;
    }

    getBuffer ()  {
        const buffer = new Uint8Array(this.bytes.length);

        for (let i = 0; i < this.bytes.length; i++) {
            buffer[i] = this.bytes[i];
        }

        return buffer;
    }

    writeBoolean (bool: boolean) {
        bool = bool === true ? bool : false; // force value to be boolean.

        this.bytes.push(bool ? 1 : 0);
    }

    writeUint8 (byte: number) {
        byte = clampNumber(byte, 0, 0xFF) | 0; // convert value into uint8.

        this.bytes.push(byte);
    }

    writeInt16 (short: number) {
        short = clampNumber(short, -0x8000, 0x7FFF) | 0;

        this._writeValue(Int16Array, short);
    }

    writeUint16 (ushort: number) {
        ushort = clampNumber(ushort, 0, 0xFFFF) | 0;

        this._writeValue(Uint16Array, ushort);
    }

    writeInt32 (int: number) {
        int = clampNumber(int, -0x8000_0000, 0x7FFF_FFFF) | 0;

        this._writeValue(Int32Array, int);
    }

    writeUint32 (uint: number) {
        uint = clampNumber(uint, 0, 0xFFFF_FFFF) | 0;

        this._writeValue(Uint32Array, uint);
    }

    writeInt64 (long: number | bigint) {
        if (typeof long === 'number') long = BigInt(long);

        this._writeValue(BigInt64Array, long);
    }

    writeUint64 (ulong: number | bigint ) {
        if (typeof ulong === 'number') ulong = BigInt(ulong);

        this._writeValue(BigUint64Array, ulong);
    }

    writeFloat32 (single: number) {
        this._writeValue(Float32Array, single);
    }

    writeFloat64 (double: number) {
        this._writeValue(Float64Array, double);
    }

    private _writeValue<T extends _BinaryArray> (
        ArrayType: {new(length: number): T; BYTES_PER_ELEMENT: number},
        value: number | bigint
    ) {
        const arr = new ArrayType(1);
        arr[0] = value as any;
        const byteArr = new Uint8Array(arr.buffer);

        for (const byte of byteArr) {
            this.bytes.push(byte);
        }
    }
}