#!/usr/bin/env node
import {getOptions, hasPackageJson, writeFile, readJson} from './utils';
import configureEslint from './eslint';
import configureTypescript from './typescript';
import configurePrettier from './prettier';
import configureJest from './jest';
import configureGithubActions from './github-action';
import configureSemanticRelease from './semantic-release';
import configureCommitLint from './commitlint';
import configureSortPackageJson from './sortPackageJson';
import {existsSync} from 'fs';

const configure = () => {
  console.log('configuring');
  const options = getOptions();
  let config;
  try {
    config = readJson(`${options.root}/package.json`);
  } catch (error) {
    throw new Error(
      'Missing package.json file! Are you running this in a subfolder?',
    );
  }
  if (options.typescript) {
    configureTypescript(options);
    console.log('configured typescript');
  }
  if (options.eslint) {
    configureEslint(options);
    console.log('configured eslint');
  }
  if (options.prettier) {
    configurePrettier(options);
    console.log('configured prettier');
  }
  if (options.jest) {
    configureJest(options);
    console.log('configured jest');
  }
  if (options.semanticRelease) {
    configureSemanticRelease(options);
    console.log('configured semantic-release');
  }
  if (options.githubActions) {
    configureGithubActions(options);
    console.log('configured github actions');
  }
  if (options.commitlint) {
    configureCommitLint(options);
    console.log('configured commitlint');
  }
  if (options.sortPackageJson) {
    configureSortPackageJson(options);
    console.log('configured sort-package-json');
  }
  writeFile(
    `${options.root}/LICENSE`,
    `ISC License (ISC)
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
PERFORMANCE OF THIS SOFTWARE.`,
  );
  if (!existsSync(`${options.root}/README.md`)) {
    const {name} = readJson(`${options.root}/package.json`);
    writeFile(`${options.root}/README.md`, `# ${name}`);
  }
  console.log('finished');
};

export default configure;
