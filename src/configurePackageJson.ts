import {Options, writeJson, stage} from './utils';
import getPackageJsonConfig from './getPackageJsonConfig';

const configurePackageJson = (options: Options) => {
  writeJson(`${options.root}/package.json`, getPackageJsonConfig(options));
  stage(`${options.root}/package.json`, options);
};

export default configurePackageJson;
