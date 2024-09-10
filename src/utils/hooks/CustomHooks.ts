import {
    Dispatch,
    EventHandler,
    FormEvent,
    SetStateAction,
    useRef,
    useState,
} from "react";
import { getCoercionObj, getKeys, ObjectKeys } from "../General";
import { InputErrors, Optional } from "../Types";

function isInputTarget(
    target: EventTarget
): target is typeof target & { id: string; value: string } {
    const aux = target as any;
    return !!(aux.id && aux.value != null);
}

/*Use user paste text in a filed changes are no detected */
export type Validator<T extends object, E = string> = {
    [prop in keyof T]?: (input: Optional<T>) => E | void;
};

export function useFormInput<T extends object>(
    inputStructure: T
): [Optional<T>, ObjectKeys<T>, EventHandler<FormEvent>, () => void] {
    const input = useRef<Optional<T>>({});
    const coercionObj = useRef(getCoercionObj(inputStructure));

    return [input.current, getKeys(inputStructure), updateInput, reset];

    function updateInput(e: FormEvent): void {
        if (e.type === "change" && isInputTarget(e.target)) {
            const value = (coercionObj.current as any)[e.target.id](
                e.target.value
            );
            (input.current as any)[e.target.id] =
                value === "" ? undefined : value;
            //setInput({ ...input, [e.target.id]: e.target.value });
        }
    }

    function reset() {
        input.current = {};
    }
}

export function useFormInputWithErrors<T extends object, E = string>(
    inputStructure: T,
    validator: Validator<T, E>
): [
    Optional<T>,
    ObjectKeys<T>,
    EventHandler<FormEvent>,
    InputErrors<Optional<T>, E>,
    () => boolean,
    Dispatch<SetStateAction<InputErrors<Optional<T>, E>>>,
    () => void
] {
    const [errors, setErrors] = useState({} as InputErrors<Optional<T>, E>);

    const [data, keys, updateInput, reset] = useFormInput(inputStructure);

    return [data, keys, updateInput, errors, checkData, setErrors, reset];

    function checkData(): boolean {
        let errors = {} as InputErrors<Optional<T>, E>;
        let error: E | void;
        let dataInvalid: boolean = false;

        for (let key in inputStructure) {
            if (!validator[key]) {
                continue;
            }
            error = validator[key]!(data);
            if (error) {
                errors[key] = error;
                dataInvalid || (dataInvalid = true);
            }
        }
        if (dataInvalid) {
            setErrors(errors);
        }
        return dataInvalid;
    }
}
