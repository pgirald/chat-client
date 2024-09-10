/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: 'jsdom',
  transform: {
    "^.+.tsx?$": ["ts-jest", { useESM: true }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.(j|t)s$': '$1',
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  roots: ["tests"],
  testPathIgnorePatterns: ["/tests/WithSideEffect/"],
};