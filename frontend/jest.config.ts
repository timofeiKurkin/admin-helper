const {createDefaultPreset} = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    testMatch: ['**/__tests__/**/*.test.ts?(x)'],
    transform: {
        ...tsJestTransformCfg,
    },
};