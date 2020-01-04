import {Options, writeFile} from './utils';
import {mkdirSync} from 'fs';

const getYml = (options: Options) => {
  let yml = `name: Test & Publish

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [8.x, 10.x, 12.x]
    steps:
      - name: Test w/ Node.js \${{matrix.node-version }}
      - uses: actions/checkout@v1
      - uses: actions/setup-node@v1
        with:
          node-version: \${{ maxtrix.node-version }}
      - run: |
          npm ci
          npm run lint
          npm test
        env:
          CI: true`;
  if (options.semanticRelease) {
    yml += `

  release:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: actions/setup-node@v1
        with:
          node-version: 12
          registry-url: https://registry.npmjs.org/
      - run: |
          npm ci
          npx semantic-release
        env:
          CI: true
          GITHUB_TOKEN: \${{ secrets.GH_TOKEN }}
          NPM_TOKEN: \${{ secrets.NPM_TOKEN }}
`;
  }
  return yml;
};

const configureGithubActions = (options: Options) => {
  mkdirSync(`${options.root}/.github/workflows`, {recursive: true});
  writeFile(`${options.root}/.github/workflows/jobs.yml`, getYml(options));
};

export default configureGithubActions;