import {Options, stage} from './utils';
import {readFileSync, writeFileSync} from 'fs';

const configureLicense = (options: Options) => {
  const license = readFileSync(`${options.confRoot}/LICENSE.md`);
  writeFileSync(`${options.root}/LICENSE.md`, license);
  stage(`${options.root}/LICENSE.md`, options);
  return license;
};

export default configureLicense;
