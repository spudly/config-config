import {Options, writeJson, mergeDeep, readJson, getVersion} from './utils';

const configureCommitLint = (options: Options) => {
  writeJson(
    `${options.root}/package.json`,
    mergeDeep(readJson(`${options.root}/package.json`), {
      devDependencies: {
        '@commitlint/cli': getVersion('@commitlint/cli', options),
        '@commitlint/config-conventional': getVersion(
          '@commitlint/config-conventional',
          options,
        ),
      },
      commitlint: {extends: ['@commitlint/config-conventional']},
    }),
  );
};

export default configureCommitLint;
