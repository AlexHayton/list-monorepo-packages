import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  preset: 'ts-jest/presets/js-with-ts-esm',
};

export default jestConfig;
