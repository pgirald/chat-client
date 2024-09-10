export function firstToUpperCase(str: string) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function defaultStrPredicate(value: string, filter: string) {
    return value.toLowerCase().includes(filter.toLowerCase());
}

export function onlyNumbers(char: string) {
    return char >= "0" && char <= "9";
}

export function onlyLetters(char: string) {
    return (char >= "A" && char <= "Z") || (char >= "a" && char <= "z");
}

export function isAValidEmail(email: string) {
    const validEmalRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return validEmalRegex.test(email);
}
