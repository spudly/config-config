import {mergeDeep, readJson, writeJson, getVersion, Options} from './utils';
import configureHusky from './husky';

const configureLintStaged = (options: Options) => {
  configureHusky(options);
  writeJson(
    `${options.root}/package.json`,
    mergeDeep(readJson(`${options.root}/package.json`), {
      devDependencies: {
        'lint-staged': getVersion('lint-staged', options),
      },
      'lint-staged': {
        [options.typescript ? '*.{js,jsx,ts,tsx}' : '*.{js,jsx}']:
          options.prettier || options.eslint
            ? [
                options.prettier ? 'prettier --write' : undefined,
                options.eslint ? 'eslint --fix' : undefined,
                'git add',
              ].filter(Boolean)
            : undefined,
        '*.{json,md,htm,html,css}': options.prettier
          ? ['prettier --write', 'git add']
          : undefined,
      },
    }),
  );
};

export default configureLintStaged;
