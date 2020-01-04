#!/usr/bin/env node
import {getOptions, hasPackageJson, createPackageJson} from './utils';
import configureEslint from './eslint';
import configureTypescript from './typescript';
import configurePrettier from './prettier';
import configureJest from './jest';
import configureGithubActions from './github-action';
import configureSemanticRelease from './semantic-release';
import configureCommitLint from './commitlint';

const configure = () => {
  console.log('configuring');
  const options = getOptions();
  if (!hasPackageJson(options.root)) {
    createPackageJson(options.root);
    console.log('created package.json file');
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
  console.log('finished');
};

export default configure;
