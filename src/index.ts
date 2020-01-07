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
  let yml = `name: build

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
        run: npm test -- --coverage
      - name: codecov
        uses: codecov/codecov-action@v1
        with:
          token: \${{ secrets.CODECOV_TOKEN }}
          fail_ci_if_error: true`;

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
          NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}  
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

const getContributingInstructions = () => `# Contributing

Thank you for your interest in contributing to this project. All contributions
are welcome and appreciated including code, documentation, answers to questions,
etc.

## Helpful Links

- [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)
- [@spudly/config-config](https://github.com/spudly/config-config)
- [all-contributors](https://github.com/all-contributors/all-contributors)
`;

const getCodeOfContuct = () => `# Contributor Covenant Code of Conduct

## Our Pledge

We as members, contributors, and leaders pledge to make participation in our
community a harassment-free experience for everyone, regardless of age, body
size, visible or invisible disability, ethnicity, sex characteristics, gender
identity and expression, level of experience, education, socio-economic status,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

We pledge to act and interact in ways that contribute to an open, welcoming,
diverse, inclusive, and healthy community.

## Our Standards

Examples of behavior that contributes to a positive environment for our
community include:

- Demonstrating empathy and kindness toward other people
- Being respectful of differing opinions, viewpoints, and experiences
- Giving and gracefully accepting constructive feedback
- Accepting responsibility and apologizing to those affected by our mistakes,
  and learning from the experience
- Focusing on what is best not just for us as individuals, but for the overall
  community

Examples of unacceptable behavior include:

- The use of sexualized language or imagery, and sexual attention or advances of
  any kind
- Trolling, insulting or derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or email address,
  without their explicit permission
- Other conduct which could reasonably be considered inappropriate in a
  professional setting

## Enforcement Responsibilities

Community leaders are responsible for clarifying and enforcing our standards of
acceptable behavior and will take appropriate and fair corrective action in
response to any behavior that they deem inappropriate, threatening, offensive,
or harmful.

Community leaders have the right and responsibility to remove, edit, or reject
comments, commits, code, wiki edits, issues, and other contributions that are
not aligned to this Code of Conduct, and will communicate reasons for moderation
decisions when appropriate.

## Scope

This Code of Conduct applies within all community spaces, and also applies when
an individual is officially representing the community in public spaces.
Examples of representing our community include using an official e-mail address,
posting via an official social media account, or acting as an appointed
representative at an online or offline event.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported to the community leaders responsible for enforcement at [INSERT CONTACT
METHOD]. All complaints will be reviewed and investigated promptly and fairly.

All community leaders are obligated to respect the privacy and security of the
reporter of any incident.

## Enforcement Guidelines

Community leaders will follow these Community Impact Guidelines in determining
the consequences for any action they deem in violation of this Code of Conduct:

### 1. Correction

**Community Impact**: Use of inappropriate language or other behavior deemed
unprofessional or unwelcome in the community.

**Consequence**: A private, written warning from community leaders, providing
clarity around the nature of the violation and an explanation of why the
behavior was inappropriate. A public apology may be requested.

### 2. Warning

**Community Impact**: A violation through a single incident or series of
actions.

**Consequence**: A warning with consequences for continued behavior. No
interaction with the people involved, including unsolicited interaction with
those enforcing the Code of Conduct, for a specified period of time. This
includes avoiding interactions in community spaces as well as external channels
like social media. Violating these terms may lead to a temporary or permanent
ban.

### 3. Temporary Ban

**Community Impact**: A serious violation of community standards, including
sustained inappropriate behavior.

**Consequence**: A temporary ban from any sort of interaction or public
communication with the community for a specified period of time. No public or
private interaction with the people involved, including unsolicited interaction
with those enforcing the Code of Conduct, is allowed during this period.
Violating these terms may lead to a permanent ban.

### 4. Permanent Ban

**Community Impact**: Demonstrating a pattern of violation of community
standards, including sustained inappropriate behavior, harassment of an
individual, or aggression toward or disparagement of classes of individuals.

**Consequence**: A permanent ban from any sort of public interaction within the
project community.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage],
version 2.0, available at
https://www.contributor-covenant.org/version/2/0/code_of_conduct.html.

Community Impact Guidelines were inspired by
[Mozilla's code of conduct enforcement ladder](https://github.com/mozilla/diversity).

[homepage]: https://www.contributor-covenant.org

For answers to common questions about this code of conduct, see the FAQ at
https://www.contributor-covenant.org/faq. Translations are available at
https://www.contributor-covenant.org/translations.`;

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
    publishConfig: {
      access: 'public',
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

  writeFileSync(`${options.root}/LICENSE.md`, getLicense());
  writeFileSync(`${options.root}/CODE_OF_CONDUCT.md`, getCodeOfContuct());
  writeFileSync(
    `${options.root}/CONTRIBUTING.md`,
    getContributingInstructions(),
  );
  if (!existsSync(`${options.root}/README.md`)) {
    writeFileSync(`${options.root}/README.md`, getReadme(packageConfig.name));
  }
  if (options.stage) {
    execSync(
      'git add package.json tsconfig.json .github/workflows/workflow.yml LICENSE.md README.md CONTRIBUTING.md CODE_OF_CONDUCT.md',
      {cwd: options.root},
    );
  }
};

export default configure;
