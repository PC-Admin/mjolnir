/*
Copyright 2022 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

export class ProtectionSettingValidationError extends Error {};

export class AbstractProtectionSetting<TChange, TValue> {
    // the current value of this setting
    value: TValue

    /*
     * Deserialise a value for this setting type from a string
     *
     * @param data Serialised value
     * @returns Deserialised value or undefined if deserialisation failed
     */
    fromString(data: string): TChange | undefined {
        throw new Error("not Implemented");
    }

    /*
     * Check whether a given value is valid for this setting
     *
     * @param data Setting value
     * @returns Validity of provided value
     */
    validate(data: TChange): boolean {
        throw new Error("not Implemented");
    }

    /*
     * Store a value in this setting, only to be used after `validate()`
     * @param data Validated setting value
     */
    setValue(data: TValue) {
        this.value = data;
    }
}
export class AbstractProtectionListSetting<TChange, TValue> extends AbstractProtectionSetting<TChange, TValue> {
    /*
     * Add `data` to the current setting value, and return that new object
     *
     * @param data Value to add to the current setting value
     * @returns The potential new value of this setting object
     */
    addValue(data: TChange): TValue {
        throw new Error("not Implemented");
    }

    /*
     * Remove `data` from the current setting value, and return that new object
     *
     * @param data Value to remove from the current setting value
     * @returns The potential new value of this setting object
     */
    removeValue(data: TChange): TValue {
        throw new Error("not Implemented");
    }
}
export function isListSetting(object: any): object is AbstractProtectionListSetting<any, any> {
    return object instanceof AbstractProtectionListSetting;
}


export class StringProtectionSetting extends AbstractProtectionSetting<string, string> {
    value = "";
    fromString = (data) => data;
    validate = (data) => true;
}
export class StringListProtectionSetting extends AbstractProtectionListSetting<string, string[]> {
    value: string[] = [];
    fromString = (data) => data;
    validate = (data) => true;
    addValue(data: string): string[] {
        return [...this.value, data];
    }
    removeValue(data: string): string[] {
        const index = this.value.indexOf(data);
        return this.value.splice(index, index + 1);
    }
}

export class NumberProtectionSetting extends AbstractProtectionSetting<number, number> {
    min: number|undefined;
    max: number|undefined;

    constructor(
            defaultValue: number,
            min: number|undefined = undefined,
            max: number|undefined = undefined
    ) {
        super();
        this.setValue(defaultValue);
        this.min = min;
        this.max = max;
    }

    fromString(data) {
        let number = Number(data);
        return isNaN(number) ? undefined : number;
    }
    validate(data) {
        return (!isNaN(data)
            && (this.min === undefined || this.min <= data)
            && (this.max === undefined || data <= this.max))
    }

}