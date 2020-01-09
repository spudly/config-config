import {readPackageJson, Options, mergeDeep} from './utils';
import getPackageJsonScripts from './getPackageJsonScripts';
import getDevDependencies from './getDevDependencies';
import getLintStagedConfig from './getLintStagedConfig';
import getHuskyConfig from './getHuskyConfig';
import getJestConfig from './getJestConfig';
import getPrettierConfig from './getPrettierConfig';
import getEslintConfig from './getEslintConfig';
import getEslintIgnore from './getEslintIgnore';
import getCommitlintConfig from './getCommitlintConfig';
import getSemanticReleaseConfig from './getSemanticReleaseConfig';

const getPackageJsonConfig = (options: Options) => {
  const oldConfig = readPackageJson(options.root);
  return mergeDeep(oldConfig, {
    scripts: getPackageJsonScripts(options),
    devDependencies: getDevDependencies(options),
    publishConfig: {
      access: 'public',
    },
    files: ['build', 'bin'],
    eslintConfig: options.eslint ? getEslintConfig(options) : undefined,
    eslintIgnore: options.eslint ? getEslintIgnore(options) : undefined,
    'lint-staged': options.lintStaged
      ? getLintStagedConfig(options)
      : undefined,
    husky: options.husky ? getHuskyConfig(options) : undefined,
    prettier: options.prettier ? getPrettierConfig(options) : undefined,
    commitlint: options.commitlint ? getCommitlintConfig(options) : undefined,
    jest: options.jest ? getJestConfig(options) : undefined,
    release: options.semanticRelease
      ? getSemanticReleaseConfig(options)
      : undefined,
  });
};

export default getPackageJsonConfig;
