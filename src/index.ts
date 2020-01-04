#!/usr/bin/env node
import {getOptions, hasPackageJson} from './utils';
import configureEslint from './eslint';
import configureTypescript from './typescript';
import configurePrettier from './prettier';
import configureJest from './jest';
import configureGithubActions from './github-action';
import configureSemanticRelease from './semantic-release';
import configureCommitLint from './commitlint';
import configureSortPackageJson from './sortPackageJson';

const configure = () => {
  console.log('configuring');
  const options = getOptions();
  if (!hasPackageJson(options.root)) {
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
  console.log('finished');
};

export default configure;
