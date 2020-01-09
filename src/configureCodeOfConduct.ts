import {Options, stage} from './utils';
import {readFileSync, writeFileSync} from 'fs';

const configureCodeOfConduct = (options: Options) => {
  const codeOfCOnduct = readFileSync(`${options.confRoot}/CODE_OF_CONDUCT.md`);
  writeFileSync(`${options.root}/CODE_OF_CONDUCT.md`, codeOfCOnduct);
  stage(`${options.root}/CODE_OF_CONDUCT.md`, options);
};

export default configureCodeOfConduct;
