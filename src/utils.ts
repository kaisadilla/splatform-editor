import { MONTHS } from "_constants";
import { saveAs } from "file-saver";

export const LOCALE = "en-US";

export type TextColor = 'black' | 'white';

export interface ConditionalClass {
    [className: string]: boolean;
}

export interface WithId<T> {
    id: string;
    object: T;
}

export class Vec2 {
    public x: number = 0;
    public y: number = 0;

    public constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public toString () {
        return `(${this.x}, ${this.y})`;
    }
}

/**
 * Generates the className string from the arguments given.
 * Two types of arguments can be passed:
 ** A string, which will be added to the class names.
 ** An array containing a string and a boolean. The string will be added as
 * a class name only if the boolean given is true.
 * @param params 
 * @returns 
 */
export function getClassString (
    ...params: (string | boolean | [string, boolean | undefined] | undefined | null)[]
) : string
{
    let str = "";

    for (const classEntry of params) {
        if (classEntry === undefined) {
            continue;
        }
        if (classEntry === null) {
            continue;
        }
        if (classEntry === false) {
            continue;
        }
        // if the entry is conditional.
        if (Array.isArray(classEntry)) {
            if (classEntry[1]) {
                str += classEntry[0] + " ";
            }
        }
        else {
            str += classEntry + " ";
        }
    }

    return str.trim();
}

export function getRandomHexColor (useHashtag: boolean = true) : string {
    const col = Math.floor(Math.random() * 16_777_215)
        .toString(16).padStart(6, "0");

    return useHashtag ? "#" + col : col;
}

export function addMinutes (date: Date, minutes: number) : Date {
    return new Date(date.getTime() + minutes * 60_000);
}

export function formatDateString (dateStr: string) : string {
    const localDate = new Date(dateStr);

    // if the date is invalid, its "correct format" is an empty string.
    if (isNaN(localDate.getTime())) {
        return "";
    }

    // remove
    const agnosticDate = addMinutes(localDate, -localDate.getTimezoneOffset());

    return agnosticDate.toISOString().split("T")[0];
}

///export function saveAsFile (fileName: string, content: string) {
///    const blob = new Blob([content], {
///        type: "text/plain;charset=utf-8"
///    });
///    saveAs(blob, fileName);
///}
///
///export function readTextFile (file: File) : Promise<string | null> {
///    return new Promise((resolve, reject) => {
///        const reader = new FileReader();
///        reader.readAsText(file, "UTF-8");
///    
///        reader.onload = (evt => {
///            const content = evt.target?.result;
///            if (content && typeof content === "string") {
///                resolve(content);
///            }
///            else if (content) {
///                reject("Content type was not string.");
///            }
///            else {
///                reject("No content was found on the file given.");
///            }
///        });
///    });
///}

export function cropString (
    str: string, maxLength: number, ellipsis: boolean = false
) : string
{
    if (str.length <= maxLength) return str;

    str = str.substring(0, maxLength);

    return ellipsis ? str + "..." : str;
}

export function formatNumber (number: number, decimalPlaces: number) {
    return number.toLocaleString("en-US", {
        minimumIntegerDigits: 1,
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    });
}

export function generateRandomColor () {
    const col = Math.floor(Math.random() * 0xffffff).toString(16);

    return "#" + col;
}

/**
 * Filters the elements in the array given with the filter given, using a smart
 * function, and returns a new array with the filtered elements.
 * @param arr The array to filter.
 * @param filter The filter to pass.
 * @param caseSensitive If true, won't ignore character case when filtering.
 */
export function smartFilterArray (
    arr: string[], filter: string, caseSensitive?: boolean
) {
    const regex = __buildSmartFilterRegex(filter, caseSensitive);

    return arr.filter(str => {
        if (!caseSensitive) {
            str = str.toLocaleLowerCase(LOCALE);
        }

        return str.match(regex) !== null
    });
}

export function smartFilterObjectArray<T> (
    arr: T[],
    filter: string,
    fieldSelector: (obj: T) => string,
    caseSensitive: boolean = false
) {
    const regex = __buildSmartFilterRegex(filter, caseSensitive);

    return arr.filter(obj => {
        let str = fieldSelector(obj);

        if (!caseSensitive) {
            str = str.toLocaleLowerCase(LOCALE);
        }

        return str.match(regex) !== null;
    });
}

export function matchesSmartFilter (
    value: string, filter: string, caseSensitive: boolean = false
) {
    const regex = __buildSmartFilterRegex(filter, caseSensitive);
    if (!caseSensitive) {
        value = value.toLocaleLowerCase(LOCALE);
    }

    return value.match(regex) !== null;
}

export function clampNumber (num: number, min: number, max: number) {
    return Math.max(Math.min(num, max), min);
}

export function truncateNumber (num: number, decimalPlaces: number) {
    const multiplier = 10 ** decimalPlaces;
    const numToTrim = num * multiplier;
    const truncated = Math[numToTrim < 0 ? 'ceil' : 'floor'](numToTrim);
    return truncated / multiplier;
}

export function numberToBaseString (num: number, base: number, decimalPlaces: number = 0) {
    return truncateNumber(num, decimalPlaces).toString(base);
}

export function countDecimalPlaces (num: number) {
    if (isInteger(num)) return 0;

    return num.toString().split(".")[1].length || 0;
}

export function isInteger (num: number) {
    return Math.floor(num) === num;
}

export function isStringNullOrEmpty (str: string | null | undefined) {
    return !(str !== null && str !== undefined && str !== "");
}

/**
 * Given the hex color of a background, calculates whether the color of higher
 * contrast for text in that background is black or white.
 * @param background 
 */
export function chooseW3CTextColor (background: string) : TextColor {
    // Done according to this: https://stackoverflow.com/a/3943023/23342298

    if (background.startsWith("#")) background = background.substring(1, 7);
    if (background.length < 6) throw `'${background}' is not a valid color.`;


    const r = parseInt(background.substring(0, 2), 16);
    const g = parseInt(background.substring(2, 4), 16);
    const b = parseInt(background.substring(4, 6), 16);

    let rVal = calculateVal(r);
    let gVal = calculateVal(g);
    let bVal = calculateVal(b);

    const l = (0.2126 * rVal) + (0.7152 * gVal) + (0.0722 * bVal);

    return l > 0.179 ? 'black' : 'white';

    function calculateVal (c: number) {
        c /= 255;

        if (c < 0.04045) {
            return c / 12.92;
        }
        else {
            return ((c + 0.055) / 1.055) ** 2.4;
        }
    }
}

export function dateToDisplayName (date: Date) {
    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

/**
 * Returns true if the value given is null, undefined or is an empty string.
 * @param value 
 * @returns 
 */
export function valueNullOrEmpty<T> (value: T | null | undefined) {
    return value === null || value === undefined || value === "";
}

export function deleteArrayItemAt<T> (arr: T[], index: number) {
    arr.splice(index, 1);
}

export function deleteArrayItem<T> (arr: T[], item: T) {
    const index = arr.indexOf(item);
    if (index !== -1) {
        deleteArrayItemAt(arr, index);
    }
}

export function arrayUnion (a: any[], b: any[]) {
    const set = new Set<any>();

    for (const item of [...a, ...b]) {
        set.add(item);
    }

    return Array.from(set);
}

/**
 * Normalizes the internal names of all elements of an array. This means that
 * any empty internal name is filled in with one obtained from the source
 * given. Repeated names are replaced with unique ones.
 * @param arr The array to normalize.
 * @param idFieldName The field containing the id.
 * @param sourceSelector A method to choose which name to use to create internal
 * names.
 */
export function normalizeInternalNames<T> (
    arr: T[], idFieldName: keyof T,
    sourceSelector: (el: T) => string,
    existingNamesSet = new Set<string>(),
) {
    for (const el of arr) {
        // if the element has no internal name, create one from its names.
        if (isStringNullOrEmpty(el[idFieldName] as string)) {
            el[idFieldName] = sourceSelector(el)
                .toLocaleLowerCase(LOCALE)
                .replaceAll(" ", "_")
                .replaceAll(/[^a-zA-Z0-9_]*/g, "") as any;
        }
        else {
            // purge all non-alphanumeric or underscore characters.
            el[idFieldName] = (el[idFieldName] as string)
                .replaceAll(/[^a-zA-Z0-9_]*/g, "") as any;
        }

        // if the element's internal name already exists in this league, append
        // a number to its end.
        let finalInternalName = el[idFieldName] as string;
        let index = 0;
        while (existingNamesSet.has(finalInternalName)) {
            finalInternalName = `${el[idFieldName]}_${index}`;
            index++;
        }
        existingNamesSet.add(finalInternalName);

        el[idFieldName] = finalInternalName as any;
    }
}

export function isString (object: any) {
    return typeof object === 'string' || object instanceof String;
}

export function timeStringToNumber (time: string | undefined | null) {
    if (!time) return null;

    const values = time.split(":");
    const hour = Number(values[0]);
    const minutes = Number(values[1]);

    return (hour + (minutes / 60)) / 24;
}

export function timeNumberToString (time: number | undefined | null) {
    if (time === undefined || time === null) return null;

    time *= 24;
    const hour = (time | 0) % 24;
    const minutes = time % 1;

    return hour.toString().padStart(2, '0')
        + ":"
        + (minutes * 59).toFixed(0).padStart(2, '0');
}

/**
 * Replaces the character '#' in the string given for its HTML safe
 * representation: '%23'.
 * @param path 
 * @returns 
 */
export function cureHtmlPath (path: string) {
    return path.replace("#", "%23");
}

function __buildSmartFilterRegex (filter: string, caseSensitive?: boolean) {
    try {
        let regexStr = "";
        if (filter.length < 2) {
            regexStr = filter;
        }
        // build a regex on the form of: C.*C.*C.*C.*C, where C is each character
        // in the filter.
        else {
            for (let i = 0; i < filter.length - 1; i++) {
                regexStr += filter[i] + ".*";
            }
            regexStr += filter[filter.length - 1];
        }
    
        if (!caseSensitive) {
            // todo: locale stuff.
            regexStr = regexStr.toLocaleLowerCase(LOCALE);
        }
    
        // escape characters that need escaping in regex.
        regexStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(regexStr);
    }
    catch (ex) {
        console.error(
            `There was a problem while building a smart filter regex for ${filter}`,
            ex
        );

        return /^$/g;
    }
}

/**
 * Returns the value of the css variable given.
 * @param variable The css variable to look for.
 * @returns 
 */
export function getCssVariableValue (variable: string) {
    return window.getComputedStyle(document.body).getPropertyValue(variable);
}