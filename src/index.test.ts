import tmp, {DirResult} from 'tmp';
import fs from 'fs';
import configConfig from './index';
import {readFileSync} from 'fs';
import {execSync} from 'child_process';

const tmpObjs: Array<DirResult> = [];

const LICENSE = fs.readFileSync(`${__dirname}/../LICENSE.md`, 'utf8');
const CONTRIBUTING = fs.readFileSync(`${__dirname}/../CONTRIBUTING.md`, 'utf8');
const CODE_OF_CONDUCT = fs.readFileSync(
  `${__dirname}/../CODE_OF_CONDUCT.md`,
  'utf8',
);
const TSCONFIG = fs.readFileSync(`${__dirname}/../tsconfig.json`, 'utf8');

const setup = () => {
  const tmpObj = tmp.dirSync();
  const dir = tmpObj.name;
  execSync('git init', {cwd: dir});
  tmpObjs.push(tmpObj);
  fs.writeFileSync(
    `${dir}/package.json`,
    JSON.stringify({name: 'test-test', version: '1.2.3'}, null, 2),
  );

  return dir;
};

afterEach(() => {
  let o;
  while ((o = tmpObjs.shift())) {
    o.removeCallback();
  }
});

describe('w/ no args', () => {
  let dir: string;
  beforeAll(() => {
    dir = setup();
    configConfig(dir, []);
  });

  test('package.json', () => {
    expect(JSON.parse(readFileSync(`${dir}/package.json`, 'utf8')))
      .toMatchInlineSnapshot(`
      Object {
        "commitlint": Object {
          "extends": Array [
            "@commitlint/config-conventional",
          ],
        },
        "devDependencies": Object {
          "@commitlint/cli": "^8.3.4",
          "@commitlint/config-conventional": "^8.3.4",
          "@semantic-release/changelog": "^3.0.6",
          "@semantic-release/git": "^7.0.18",
          "@spudly/eslint-config": "^6.0.0",
          "@types/jest": "^24.0.25",
          "@types/node": "^13.1.4",
          "eslint": "^6.8.0",
          "husky": "^3.1.0",
          "jest": "^24.9.0",
          "lint-staged": "^9.5.0",
          "prettier": "^1.19.1",
          "semantic-release": "^15.14.0",
          "sort-package-json": "^1.36.0",
          "ts-jest": "^24.2.0",
          "typescript": "^3.7.4",
        },
        "eslintConfig": Object {
          "extends": "@spudly",
        },
        "eslintIgnore": Array [
          "node_modules",
          "build",
        ],
        "files": Array [
          "build",
          "bin",
        ],
        "husky": Object {
          "hooks": Object {
            "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
            "pre-commit": "npx config-config --stage && npm run lint && npm run test && lint-staged",
          },
        },
        "jest": Object {
          "collectCoverageFrom": Array [
            "**/*.ts",
            "**/*.tsx",
            "**/*.js",
            "**/*.jsx",
            "!**/node_modules/**",
          ],
          "coveragePathIgnorePatterns": Array [
            "/node_modules/",
            "/build/",
            "[.]config[.]js",
            "/coverage/",
            "[.]stories[.]",
          ],
          "globals": Object {
            "ts-jest": Object {
              "isolatedModules": true,
            },
          },
          "testEnvironment": "node",
          "testPathIgnorePatterns": Array [
            "build",
            "[.]stories[.]",
          ],
          "transform": Object {
            "^.+\\\\.tsx?$": "ts-jest",
          },
        },
        "lint-staged": Object {
          "*.{js,jsx,ts,tsx}": Array [
            "prettier --write",
            "eslint --fix",
            "git add",
          ],
          "*.{json,md,htm,html,css}": Array [
            "prettier --write",
            "git add",
          ],
          "package.json": Array [
            "sort-package-json",
            "prettier --write",
            "git add",
          ],
        },
        "name": "test-test",
        "prettier": Object {
          "bracketSpacing": false,
          "endOfLine": "lf",
          "proseWrap": "always",
          "singleQuote": true,
          "trailingComma": "all",
        },
        "publishConfig": Object {
          "access": "public",
        },
        "release": Object {
          "plugins": Array [
            "@semantic-release/commit-analyzer",
            "@semantic-release/release-notes-generator",
            "@semantic-release/changelog",
            "@semantic-release/npm",
            "@semantic-release/github",
            Array [
              "@semantic-release/git",
              Object {
                "assets": Array [
                  "package.json",
                  "CHANGELOG.md",
                ],
                "message": "chore(release): \${nextRelease.version} [skip ci]

      \${nextRelease.notes}",
              },
            ],
          ],
        },
        "scripts": Object {
          "build": "tsc",
          "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
          "test": "jest",
        },
        "version": "1.2.3",
      }
    `);
  });

  test('tsconfig.json', () => {
    expect(readFileSync(`${dir}/tsconfig.json`, 'utf8')).toBe(TSCONFIG);
  });

  test('license', () => {
    expect(readFileSync(`${dir}/LICENSE.md`, 'utf8')).toBe(LICENSE);
  });

  test('contributing', () => {
    expect(readFileSync(`${dir}/CONTRIBUTING.md`, 'utf8')).toBe(CONTRIBUTING);
  });

  test('github workflow', () => {
    expect(readFileSync(`${dir}/.github/workflows/workflow.yml`, 'utf8'))
      .toMatchInlineSnapshot(`
      "name: build

      on: [push]

      jobs:
        test:
          runs-on: ubuntu-latest
          strategy:
            matrix:
              node-version: [10.x, 12.x]
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
                fail_ci_if_error: true

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
                node-version: 14
                registry-url: https://registry.npmjs.org/
            - name: install
              run: npm ci
            - name: release
              env:
                GITHUB_TOKEN: \${{ secrets.GH_TOKEN }}
                NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}  
              run: npx semantic-release"
    `);
  });

  test('code of conduct', () => {
    expect(readFileSync(`${dir}/CODE_OF_CONDUCT.md`, 'utf8')).toBe(
      CODE_OF_CONDUCT,
    );
  });

  test('readme', () => {
    expect(readFileSync(`${dir}/README.md`, 'utf8')).toMatchInlineSnapshot(
      `"# test-test"`,
    );
  });
});
