import { useState } from "react";

export function useEditorCanvas () {
    const [isKay, setKay] = useState(42);

    return isKay;
}