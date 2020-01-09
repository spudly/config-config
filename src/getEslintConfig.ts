import {Options} from './utils';

const getEslintConfig = (_options: Options) => ({
  extends: '@spudly',
});

export default getEslintConfig;
