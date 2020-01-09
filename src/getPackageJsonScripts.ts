import {Options} from './utils';

const getPackageJsonScripts = (options: Options) => ({
  build: options.typescript ? 'tsc' : undefined,
  lint: options.eslint
    ? `eslint . ${options.typescript ? '--ext .js,.jsx,.ts,.tsx' : ''}`
    : undefined,
  test: options.jest ? 'jest' : undefined,
});

export default getPackageJsonScripts;
