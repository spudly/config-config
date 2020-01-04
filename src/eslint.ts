import {writeJson, Options, mergeDeep, readJson, getVersion} from './utils';
import configureLintStaged from './lintStaged';

const configureEslint = (options: Options) => {
  configureLintStaged(options);
  const extArgs = options.typescript ? '--ext .js,.jsx,.ts,.tsx' : '';
  writeJson(
    `${options.root}/package.json`,
    mergeDeep(readJson(`${options.root}/package.json`), {
      scripts: {
        lint: `eslint . ${extArgs}`,
      },
      devDependencies: {
        eslint: getVersion('eslint', options),
        '@spudly/eslint-config': getVersion('@spudly/eslint-config', options),
      },
      eslintConfig: {
        extends: '@spudly',
      },
      eslintIgnore: ['node_modules', 'build'],
    }),
  );
};

export default configureEslint;
