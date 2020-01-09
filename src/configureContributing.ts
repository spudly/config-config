import {Options, stage} from './utils';
import {readFileSync, writeFileSync} from 'fs';

const configureContibuting = (options: Options) => {
  const contributing = readFileSync(`${options.confRoot}/CONTRIBUTING.md`);
  writeFileSync(`${options.root}/CONTRIBUTING.md`, contributing);
  stage(`${options.root}/CONTRIBUTING.md`, options);
};

export default configureContibuting;
