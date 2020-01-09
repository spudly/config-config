import {Options} from './utils';

const getPrettierConfig = (_options: Options) => ({
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: false,
  proseWrap: 'always',
  endOfLine: 'lf',
});

export default getPrettierConfig;
