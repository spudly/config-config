import {existsSync, writeFileSync} from 'fs';
import {Options, stage} from './utils';

const configureReadme = (options: Options) => {
  const readme = `# ${options.name}`;
  if (!existsSync(`${options.root}/README.md`)) {
    writeFileSync(`${options.root}/README.md`, readme);
    stage(`${options.root}/README.md`, options);
  }
};

export default configureReadme;
