import {
  mergeDeep,
  readJson,
  writeFile,
  writeJson,
  getVersion,
  Options,
} from './utils';

const getHuskyConfig = (options: Options) => {
  const tasks = [];
  if (options.eslint) {
    tasks.push('npm run lint');
  }
  if (options.jest) {
    tasks.push('npm run test');
  }
  tasks.push('lint-staged');
  return {
    hooks: {
      'pre-commit': tasks.join(' && '),
    },
  };
};

const PRETTIER_RC = `module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: false,
  proseWrap: 'always',
  endOfLine: 'lf',
};
`;

const configureHusky = (options: Options) => {
  writeJson(
    `${options.root}/package.json`,
    mergeDeep(readJson(`${options.root}/package.json`), {
      devDependencies: {
        husky: getVersion('husky', options),
      },
      husky: getHuskyConfig(options),
    }),
  );
};

export default configureHusky;
