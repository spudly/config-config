import {Options} from './utils';

const getHuskyConfig = (options: Options) => ({
  hooks: {
    'pre-commit': [
      options.root === options.confRoot
        ? 'npm run config-config -- --stage'
        : 'npx config-config --stage',
      options.eslint ? 'npm run lint' : undefined,
      options.jest ? 'npm run test' : undefined,
      'lint-staged',
    ]
      .filter(Boolean)
      .join(' && '),
    'commit-msg': options.commitlint
      ? 'commitlint -E HUSKY_GIT_PARAMS'
      : undefined,
  },
});

export default getHuskyConfig;
