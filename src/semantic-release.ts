import {Options, getVersion, writeJson, mergeDeep, readJson} from './utils';

const configureSemanticRelease = (options: Options) => {
  writeJson(
    `${options.root}/package.json`,
    mergeDeep(readJson(`${options.root}/package.json`), {
      scripts: {
        'semantic-release': 'semantic-release',
      },
      devDependencies: {
        '@semantic-release/changelog': getVersion(
          '@semantic-release/changelog',
          options,
        ),
        '@semantic-release/git': getVersion('@semantic-release/git', options),
        'semantic-release': getVersion('semantic-release', options),
      },
      release: {
        plugins: [
          '@semantic-release/changelog',
          [
            '@semantic-release/git',
            {
              assets: ['package.json'],
              message:
                // eslint-disable-next-line no-template-curly-in-string
                'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
            },
          ],
        ],
      },
    }),
  );
};

export default configureSemanticRelease;
