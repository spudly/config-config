import {Options, writeJson, readJson, getVersion, deepmerge} from './utils';

const configureTypescript = (options: Options) => {
  const devDependencies: {[key: string]: string} = {
    typescript: getVersion('typescript', options),
    '@types/node': getVersion('@types/node', options),
  };
  if (options.jest) {
    devDependencies['@types/jest'] = getVersion('@types/jest', options);
    devDependencies['ts-jest'] = getVersion('ts-jest', options);
  }
  writeJson(
    `${options.root}/package.json`,
    deepmerge(readJson(`${options.root}/package.json`), {
      scripts: {
        build: 'tsc',
      },
      devDependencies,
    }),
  );

  writeJson(`${options.root}/tsconfig.json`, {
    include: ['src/**/*'],
    compilerOptions: {
      outDir: 'build',
      rootDir: 'src',
      esModuleInterop: true,
      strict: true,
      target: 'es2015',
      moduleResolution: 'node',
      declaration: true,
      module: 'commonjs',
    },
  });
};

export default configureTypescript;
