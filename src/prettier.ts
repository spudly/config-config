import {mergeDeep, readJson, writeJson, getVersion, Options} from './utils';
import configureLintStaged from './lintStaged';

const configurePrettier = (options: Options) => {
  configureLintStaged(options);
  writeJson(
    `${options.root}/package.json`,
    mergeDeep(readJson(`${options.root}/package.json`), {
      devDependencies: {
        prettier: getVersion('prettier', options),
      },
      prettier: {
        singleQuote: true,
        trailingComma: 'all',
        bracketSpacing: false,
        proseWrap: 'always',
        endOfLine: 'lf',
      },
    }),
  );
};

export default configurePrettier;
