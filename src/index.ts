#!/usr/bin/env node
import {existsSync} from 'fs';
import {execSync} from 'child_process';
import {getOptions, hasPackageJson, createPackageJson} from './utils';
import configureEslint from './eslint';
import configureTypescript from './typescript';
import configurePrettier from './prettier';

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
  console.log('finished');
};

export default configure;
