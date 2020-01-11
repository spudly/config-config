import {readFileSync, writeFileSync, existsSync} from 'fs';
import {resolve} from 'path';
import deepmerge from 'deepmerge';
import {execSync} from 'child_process';

export type Paths = {self: string; root: string};

export type Options = {
  root: string;
  confRoot: string;
  name: string;
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
  githubUsername: string | undefined;
  repoName: string | undefined;
};

export const readJson = (file: string) =>
  JSON.parse(readFileSync(file, 'utf8'));

export const readPackageJson = (dir: string) => {
  try {
    return readJson(`${dir}/package.json`);
  } catch (error) {
    throw new Error(
      'Missing package.json file! Are you running this in a subfolder?',
    );
  }
};

export const getGithubInfo = (root: string) => {
  const stdout = execSync(`git config --get remote.origin.url`, {
    cwd: root,
    encoding: 'utf-8',
  });
  const match = stdout.match(/github\.com:(.+)\/(.+)\.git/);
  return {user: match?.[1], repo: match?.[2]};
};

export const getOptions = (root: string, args: Array<string>): Options => {
  const confRoot = resolve(__dirname, '..');
  const {user, repo} = getGithubInfo(root);
  return {
    root,
    confRoot,
    name: readPackageJson(root).name,
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
    githubUsername: user,
    repoName: repo,
  };
};

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

export const stage = (file: string, options: Options) => {
  execSync(`git add ${file}`, {cwd: options.root});
};

export const unique = <T>(array: Array<T>) => [...new Set(array)];
