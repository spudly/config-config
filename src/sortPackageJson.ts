import {Options, writeJson, mergeDeep, getVersion, readJson} from './utils';

const configureSortPackageJson = (options: Options) => {
  writeJson(
    `${options.root}/package.json`,
    mergeDeep(readJson(`${options.root}/package.json`), {
      devDependencies: {
        'sort-package-json': getVersion('sort-package-json', options),
      },
    }),
  );
};

export default configureSortPackageJson;
