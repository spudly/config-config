import {Options, getVersion} from './utils';

const getDevDependencies = (options: Options) => ({
  jest: options.jest ? getVersion('jest', options) : undefined,
  typescript: options.typescript
    ? getVersion('typescript', options)
    : undefined,
  '@types/node': options.typescript
    ? getVersion('@types/node', options)
    : undefined,
  '@types/jest':
    options.typescript && options.jest
      ? getVersion('@types/jest', options)
      : undefined,
  'ts-jest':
    options.typescript && options.jest
      ? getVersion('ts-jest', options)
      : undefined,
  eslint: options.eslint ? getVersion('eslint', options) : undefined,
  '@spudly/eslint-config': options.eslint
    ? getVersion('@spudly/eslint-config', options)
    : undefined,
  'lint-staged': options.lintStaged
    ? getVersion('lint-staged', options)
    : undefined,
  husky: options.husky ? getVersion('husky', options) : undefined,
  prettier: options.prettier ? getVersion('prettier', options) : undefined,
  '@commitlint/cli': options.commitlint
    ? getVersion('@commitlint/cli', options)
    : undefined,
  '@commitlint/config-conventional': options.commitlint
    ? getVersion('@commitlint/config-conventional', options)
    : undefined,
  '@semantic-release/changelog': options.semanticRelease
    ? getVersion('@semantic-release/changelog', options)
    : undefined,
  '@semantic-release/git': options.semanticRelease
    ? getVersion('@semantic-release/git', options)
    : undefined,
  'semantic-release': options.semanticRelease
    ? getVersion('semantic-release', options)
    : undefined,
  'sort-package-json': getVersion('sort-package-json', options),
});

export default getDevDependencies;
