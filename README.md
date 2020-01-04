# @spudly/configure

## TODO: create this package

## TODO: write this README

Requirements:

- [x] Adds husky & configures @spudly/configure to run on precommit, forcing
      configuration to be in sync
- [ ] Configures the following:
  - [x] @spudly/eslint-config (if --eslint passed)
  - [x] typescript (if --typescript passed)
  - [x] lint-staged / prettier (if --prettier passed)
  - [x] jest (if --jest passed)
  - [x] github action (lint, test, semantic-release)
  - [ ] LICENSE file
  - [ ] CONTRIBUTING file
  - [ ] README file
  - [x] CHANGELOG file (handled by semantic-release)
  - [x] add something to precommit to ensure package.json keys are sorted
  - [x] validate commit message on precommit (https://commitlint.js.org/)
  - [ ] refactor into one file, since some are difficult to separate
  - [ ] make all options default to true
