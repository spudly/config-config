import {Options, stage} from './utils';
import {readFileSync, writeFileSync} from 'fs';

const configureTsconfig = (options: Options) => {
  writeFileSync(
    `${options.root}/tsconfig.json`,
    readFileSync(`${options.confRoot}/tsconfig.json`),
  );
  stage(`${options.root}/tsconfig.json`, options);
};

export default configureTsconfig;
