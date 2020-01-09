import {Options, stage} from './utils';
import {mkdirSync, writeFileSync} from 'fs';

const TEST_JOB = `
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
          fail_ci_if_error: true`;

const RELEASE_JOB = `
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
        run: npx semantic-release`;

const configureGithubWorkflow = (options: Options) => {
  const workflow = `name: build

on: [push]

jobs:${TEST_JOB}
${options.semanticRelease ? RELEASE_JOB : ''}`;

  mkdirSync(`${options.root}/.github/workflows`, {recursive: true});
  writeFileSync(`${options.root}/.github/workflows/workflow.yml`, workflow);
  stage(`${options.root}/.github/workflows/workflow.yml`, options);
};

export default configureGithubWorkflow;
