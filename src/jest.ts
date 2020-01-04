import {mergeDeep, readJson, writeJson, getVersion, Options} from './utils';
import configureHusky from './husky';

const configureJest = (options: Options) => {
  configureHusky(options);
  writeJson(
    `${options.root}/package.json`,
    mergeDeep(readJson(`${options.root}/package.json`), {
      scripts: {
        test: 'jest',
      },
      devDependencies: {
        jest: getVersion('jest', options),
      },
      jest: {
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
      },
    }),
  );
};

export default configureJest;
