import {
	InvalidParamsError,
	range,
	typedKeys,
} from "../utils/General";

const obj: { one: string; two: string; three: number } = Object.create({
	protoProp: "moli",
});
obj.one = "one";
obj.two = "two";
obj.three = 3;

test.each([
	[{ one: 1, two: 2, three: "three" }, ["one", "two", "three"]],
	[obj, ["one", "two", "three"]],
])("Check typed keys", (obj, keys) => {
	expect(typedKeys(obj).every((k) => keys.includes(k)));
});

test.each<{
	start: number;
	end: number;
	expected: number[] | Error;
}>([
	{ start: 1, end: 5, expected: [1, 2, 3, 4, 5] },
	{ start: 0, end: 10, expected: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
	{ start: -5, end: 4, expected: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4] },
	{
		start: -50,
		end: 500,
		expected: Array.from({ length: 500 - -50 + 1 }, (_, index) => -50 + index),
	},
	{ start: 1, end: Infinity, expected: RangeError() }, //Invalid array lenght
	{ start: -Infinity, end: 4, expected: RangeError() }, //Invalid array lenght
	{ start: -Infinity, end: Infinity, expected: RangeError() }, //Invalid array lenght
	{ start: Infinity, end: 8, expected: new InvalidParamsError() }, //min must be greater than max
	{ start: NaN, end: 3, expected: RangeError() }, //Invalid array lenght
	{ start: -5, end: NaN, expected: RangeError() }, //Invalid array lenght
	{ start: NaN, end: NaN, expected: RangeError() }, //Invalid array lenght
])("Check range()", ({ start, end, expected }) => {
	if (expected instanceof Array) {
		expect(range(start, end)).toEqual(expected);
	} else if (expected instanceof Error) {
		expect(() => range(start, end)).toThrow((expected as any).constructor);
	}
});
