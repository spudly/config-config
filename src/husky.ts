import {mergeDeep, readJson, writeJson, getVersion, Options} from './utils';

const getHuskyConfig = (options: Options) => {
  const tasks = [];
  if (options.root !== options.confRoot) {
    tasks.push('npx configure');
  }
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
