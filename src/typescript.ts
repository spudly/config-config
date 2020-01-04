import {Options, writeJson, readJson, getVersion, deepmerge} from './utils';

const configureTypescript = (options: Options) => {
  writeJson(
    `${options.root}/package.json`,
    deepmerge(readJson(`${options.root}/package.json`), {
      scripts: {
        build: 'tsc',
      },
      devDependencies: {
        typescript: getVersion('typescript', options),
        '@types/node': getVersion('@types/node', options),
      },
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
