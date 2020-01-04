#!/usr/bin/env node
import {readFileSync, writeFileSync, existsSync} from 'fs';
import {resolve} from 'path';
import {execSync} from 'child_process';
import deepmerge from 'deepmerge';

export {deepmerge};

export type Paths = {self: string; root: string};

export type Options = {
  root: string;
  confRoot: string;
  eslint: boolean;
  prettier: boolean;
  semanticRelease: boolean;
  typescript: boolean;
  jest: boolean;
  webpack: boolean;
  githubActions: boolean;
  commitlint: boolean;
  sortPackageJson: boolean;
};

export const getOptions = (): Options => {
  const args = process.argv;
  const root = process.cwd();
  const confRoot = resolve(__dirname, '..');
  const all = args.includes('--all');
  return {
    root,
    confRoot,
    eslint: all || args.includes('--eslint'),
    prettier: all || args.includes('--prettier'),
    semanticRelease: all || args.includes('--semantic-release'),
    typescript: all || args.includes('--typescript'),
    jest: all || args.includes('--jest'),
    webpack: all || args.includes('--webpack'),
    githubActions: all || args.includes('--github-actions'),
    commitlint: all || args.includes('--commitlint'),
    sortPackageJson: all || args.includes('--sort-package-json'),
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

export {writeFileSync as writeFile};