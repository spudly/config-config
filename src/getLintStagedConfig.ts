import {Options} from './utils';

const getLintStagedConfig = (options: Options) => ({
  'package.json': options.sortPackageJson
    ? ['sort-package-json', 'prettier --write', 'git add']
    : undefined,
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
});

export default getLintStagedConfig;
