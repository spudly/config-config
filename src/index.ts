import configurePackageJson from './configurePackageJson';
import {getOptions} from './utils';
import configureGithubWorkflow from './configureGithubWorkflow';
import configureLicense from './configureLicense';
import configureContributing from './configureContributing';
import configureCodeOfConduct from './configureCodeOfConduct';
import configureTsconfig from './configureTsconfig';
import configureReadme from './configureReadme';

const configConfig = (root: string, args: Array<string>) => {
  const options = getOptions(root, args);
  configurePackageJson(options);
  if (options.typescript) {
    configureTsconfig(options);
  }
  if (options.githubActions) {
    configureGithubWorkflow(options);
  }
  configureLicense(options);
  configureCodeOfConduct(options);
  configureContributing(options);
  configureReadme(options);
};

export default configConfig;
