import {Options} from './utils';

const getCommitlintConfig = (_options: Options) => ({
  extends: ['@commitlint/config-conventional'],
});

export default getCommitlintConfig;
