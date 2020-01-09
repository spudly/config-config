import {Options} from './utils';

const getJestConfig = (options: Options) => ({
  transform: options.typescript ? {'^.+\\.tsx?$': 'ts-jest'} : undefined,
  testEnvironment: 'node',
  globals: {
    'ts-jest': options.typescript
      ? {
          isolatedModules: true,
        }
      : undefined,
  },
  collectCoverageFrom: [
    options.typescript ? '**/*.ts' : undefined,
    options.typescript ? '**/*.tsx' : undefined,
    '**/*.js',
    '**/*.jsx',
    '!**/node_modules/**',
  ].filter(Boolean),
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '[.]config[.]js',
    '/coverage/',
    '[.]stories[.]',
  ],
  testPathIgnorePatterns: ['build', '[.]stories[.]'],
});

export default getJestConfig;
