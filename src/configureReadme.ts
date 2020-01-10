import {writeFileSync, readFileSync} from 'fs';
import {Options, stage} from './utils';

const getInitialReadme = (options: Options) => `# @spudly/config-config

<!-- config-config:badges-start -->
<!-- config-config:badges-end -->

## Features

<span style="color: red">TODO: write this secion</span>

## Installation

\`npm install --save-dev ${options.name}\`

<span style="color: red">TODO: write this secion</span>

## Usage

<span style="color: red">TODO: write this secion</span>

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the
[all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!
`;

const badge = (text: string, imgUrl?: string, linkUrl?: string) => {
  let b = text;
  if (imgUrl) {
    b = `![${b}](${imgUrl})`;
  }
  if (linkUrl) {
    b = `[${b}](${linkUrl})`;
  }
  return b;
};

const getBadges = ({name, githubUsername, repoName}: Options) => {
  if (!githubUsername || !repoName) {
    return '';
  }
  return `
<!-- prettier-ignore-start -->
${badge(
  'GitHub Workflow Status',
  `https://img.shields.io/github/workflow/status/${githubUsername}/${repoName}/build?style=flat-square`,
)}
[![Codecov](https://img.shields.io/codecov/c/github/${githubUsername}/${repoName}?style=flat-square)](https://codecov.io/gh/${githubUsername}/${repoName})
[![version](https://img.shields.io/npm/v/${name}.svg?style=flat-square)](https://www.npmjs.com/package/${name})
[![downloads](https://img.shields.io/npm/dm/${name}.svg?style=flat-square)](http://www.npmtrends.com/${name})
[![NPM](https://img.shields.io/npm/l/${name}?style=flat-square)](https://github.com/${githubUsername}/${repoName}/blob/master/LICENSE.md)

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)
[![Code of Conduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square)](https://github.com/${githubUsername}/${repoName}/blob/master/CODE_OF_CONDUCT.md)

[![Watch on GitHub](https://img.shields.io/github/watchers/${githubUsername}/${repoName}.svg?style=social)](https://github.com/${githubUsername}/${repoName}/watchers)
[![Star on GitHub](https://img.shields.io/github/stars/${githubUsername}/${repoName}.svg?style=social)](https://github.com/${githubUsername}/${repoName}/stargazers)
[![Tweet](https://img.shields.io/twitter/url/https/github.com/${githubUsername}/${repoName}.svg?style=social)](https://twitter.com/intent/tweet?text=Check%20out%20${repoName}%20https%3A%2F%2Fgithub.com%2F${githubUsername}%2F${repoName})
<!-- prettier-ignore-end -->

`;
};

const readReadme = (options: Options) => {
  try {
    return readFileSync(`${options.root}/README.md`, 'utf-8');
  } catch (error) {
    return null;
  }
};

const updateBadges = (readme: string, options: Options) => {
  return readme.replace(
    /<!-- config-config:badges-start -->.*<!-- config-config:badges-end -->/s,
    `<!-- config-config:badges-start -->${getBadges(
      options,
    )}<!-- config-config:badges-end -->`,
  );
};

const configureReadme = (options: Options) => {
  const original = readReadme(options) || getInitialReadme(options);
  const file = `${options.root}/README.md`;

  writeFileSync(file, updateBadges(original, options));
  stage(`${options.root}/README.md`, options);
};

export default configureReadme;
