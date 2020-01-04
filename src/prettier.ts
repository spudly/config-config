import {
  mergeDeep,
  readJson,
  writeFile,
  writeJson,
  getVersion,
  Options,
} from './utils';
import configureLintStaged from './lintStaged';

const PRETTIER_RC = `module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: false,
  proseWrap: 'always',
  endOfLine: 'lf',
};
`;

const configurePrettier = (options: Options) => {
  configureLintStaged(options);
  writeJson(
    `${options.root}/package.json`,
    mergeDeep(readJson(`${options.root}/package.json`), {
      devDependencies: {
        prettier: getVersion('prettier', options),
      },
    }),
  );
  writeFile(`${options.root}/.prettierrc.js`, PRETTIER_RC);
};

export default configurePrettier;
