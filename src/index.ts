import {mkdirSync, readFileSync, writeFileSync, existsSync} from 'fs';
import {resolve} from 'path';
import deepmerge from 'deepmerge';
import {execSync} from 'child_process';

export {deepmerge};

export type Paths = {self: string; root: string};

export type Options = {
  root: string;
  confRoot: string;
  stage: boolean;
  eslint: boolean;
  prettier: boolean;
  semanticRelease: boolean;
  typescript: boolean;
  jest: boolean;
  webpack: boolean;
  githubActions: boolean;
  commitlint: boolean;
  sortPackageJson: boolean;
  husky: boolean;
  lintStaged: boolean;
};

export const getOptions = (): Options => {
  const args = process.argv;
  const root = process.cwd();
  const confRoot = resolve(__dirname, '..');
  return {
    root,
    confRoot,
    stage: args.includes('--stage'),
    eslint: !args.includes('--no-eslint'),
    prettier: !args.includes('--no-prettier'),
    semanticRelease: !args.includes('--no-semantic-release'),
    typescript: !args.includes('--no-typescript'),
    jest: !args.includes('--no-jest'),
    webpack: !args.includes('--no-webpack'),
    githubActions: !args.includes('--no-github-actions'),
    commitlint: !args.includes('--no-commitlint'),
    sortPackageJson: !args.includes('--no-sort-package-json'),
    husky: !args.includes('--no-husky'),
    lintStaged: !args.includes('--no-lint-staged'),
  };
};

export const readJson = (file: string) =>
  JSON.parse(readFileSync(file, 'utf8'));

export const writeJson = (file: string, data: any) =>
  writeFileSync(file, JSON.stringify(data, null, 2));

let _versions: {[moduleId: string]: string} | null = null;

export const getVersion = (moduleId: string, options: Options): string => {
  if (!_versions) {
    const json = readJson(`${options.confRoot}/package.json`);
    _versions = {
      ...json.dependencies,
      ...json.devDependencies,
      ...json.peerDependencies,
    };
  }
  const version: string | undefined = _versions![moduleId];
  if (!version) {
    throw new Error(`unable to get version for ${moduleId}`);
  }
  return version;
};

export const mergeDeep = <T extends {[key: string]: any}>(
  ...args: Array<T>
): T =>
  deepmerge.all(args, {
    // don't merge arrays. overwrite them.
    arrayMerge: (_, newArray) => newArray,
  }) as T;

export const hasPackageJson = (dir: string) =>
  existsSync(`${dir}/package.json`);

const getGithubActionsConfig = (options: Options) => {
  let yml = `name: Test & Publish

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [8.x, 10.x, 12.x]
    env:
      CI: true
    steps:
      - name: checkout
        uses: actions/checkout@v1
      - name: setup node \${{matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: \${{ matrix.node-version }}
      - name: install
        run: npm ci
      - name: build
        run: npm build
      - name: lint
        run: npm run lint
      - name: test
        run: npm test`;
  if (options.semanticRelease) {
    yml += `

  release:
    needs: test
    runs-on: ubuntu-latest
    env:
      CI: true
    steps:
      - name: checkout
        uses: actions/checkout@v1
      - name: setup node
        uses: actions/setup-node@v1
        with:
          node-version: 12
          registry-url: https://registry.npmjs.org/
      - name: install
        run: npm ci
      - name: release
        env:
          GITHUB_TOKEN: \${{ secrets.GH_TOKEN }}
          NPM_TOKEN: \${{ secrets.NPM_TOKEN }}  
        run: npx semantic-release
`;
  }
  return yml;
};

const getLicense = () => `ISC License (ISC)
Copyright (c) ${new Date().getFullYear()} Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.`;

const getPackageConfig = (options: Options) => {
  const oldConfig = readPackageJson(options);
  return mergeDeep(oldConfig, {
    scripts: {
      build: options.typescript ? 'tsc' : undefined,
      lint: options.eslint
        ? `eslint . ${options.typescript ? '--ext .js,.jsx,.ts,.tsx' : ''}`
        : undefined,
      test: options.jest ? 'jest' : undefined,
    },
    devDependencies: {
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
    },
    eslintConfig: options.eslint
      ? {
          extends: '@spudly',
        }
      : undefined,
    eslintIgnore: options.eslint ? ['node_modules', 'build'] : undefined,
    'lint-staged': {
      'package.json': options.sortPackageJson
        ? ['sort-package-json', 'prettier --write', 'git add']
        : undefined,
      [options.typescript ? '*.{js,jsx,ts,tsx}' : '*.{js,jsx}']:
        options.prettier || options.eslint
          ? [
              options.prettier ? 'prettier --write' : undefined,
              options.eslint ? 'eslint --fix' : undefined,
              'git add',
            ].filter(Boolean)
          : undefined,
      '*.{json,md,htm,html,css}': options.prettier
        ? ['prettier --write', 'git add']
        : undefined,
    },
    husky: options.husky
      ? {
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
        }
      : undefined,
    prettier: options.prettier
      ? {
          singleQuote: true,
          trailingComma: 'all',
          bracketSpacing: false,
          proseWrap: 'always',
          endOfLine: 'lf',
        }
      : undefined,
    commitlint: options.commitlint
      ? {extends: ['@commitlint/config-conventional']}
      : undefined,
    jest: options.jest
      ? {
          transform: options.typescript
            ? {'^.+\\.tsx?$': 'ts-jest'}
            : undefined,
          testEnvironment: 'node',
          globals: {
            'ts-jest': options.typescript
              ? {
                  isolatedModules: true,
                }
              : undefined,
          },
          collectCoverageFrom: [
            options.typescript ? '**/*.ts' : undefined,
            options.typescript ? '**/*.tsx' : undefined,
            '**/*.js',
            '**/*.jsx',
            '!**/node_modules/**',
          ].filter(Boolean),
          coveragePathIgnorePatterns: [
            '/node_modules/',
            '/build/',
            '[.]config[.]js',
            '/coverage/',
            '[.]stories[.]',
          ],
          testPathIgnorePatterns: ['build', '[.]stories[.]'],
        }
      : undefined,
    release: options.semanticRelease
      ? {
          plugins: [
            '@semantic-release/commit-analyzer',
            '@semantic-release/release-notes-generator',
            '@semantic-release/changelog',
            '@semantic-release/npm',
            '@semantic-release/github',
            [
              '@semantic-release/git',
              {
                assets: ['package.json', 'CHANGELOG.md'],
                message:
                  // eslint-disable-next-line no-template-curly-in-string
                  'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
              },
            ],
          ],
        }
      : undefined,
  });
};

const readPackageJson = (options: Options) => {
  try {
    return readJson(`${options.root}/package.json`);
  } catch (error) {
    throw new Error(
      'Missing package.json file! Are you running this in a subfolder?',
    );
  }
};

const getTypescriptConfig = () => ({
  include: ['src/**/*'],
  compilerOptions: {
    outDir: 'build',
    rootDir: 'src',
    esModuleInterop: true,
    strict: true,
    target: 'es2015',
    moduleResolution: 'node',
    declaration: true,
    module: 'commonjs',
  },
});

const getReadme = (name: string) => `# ${name}`;

const configure = () => {
  const options = getOptions();
  const packageConfig = getPackageConfig(options);
  writeJson(`${options.root}/package.json`, packageConfig);
  if (options.typescript) {
    writeJson(`${options.root}/tsconfig.json`, getTypescriptConfig());
  }

  if (options.githubActions) {
    mkdirSync(`${options.root}/.github/workflows`, {recursive: true});
    writeFileSync(
      `${options.root}/.github/workflows/workflow.yml`,
      getGithubActionsConfig(options),
    );
  }

  writeFileSync(`${options.root}/LICENSE`, getLicense());

  if (!existsSync(`${options.root}/README.md`)) {
    writeFileSync(`${options.root}/README.md`, getReadme(packageConfig.name));
  }
  if (options.stage) {
    execSync(
      'git add package.json tsconfig.json .github/workflows/workflow.yml LICENSE README.md',
      {cwd: options.root},
    );
  }
};

export default configure;
