# @spudly/configure

## TODO: create this package

Requirements:

- [ ] Adds husky & configures @spudly/configure to run on precommit, forcing
      configuration to be in sync
- [ ] Configures the following:
  - [x] @spudly/eslint-config (if --eslint passed)
  - [x] typescript (if --typescript passed)
  - [ ] lint-staged / prettier (if --prettier passed)
  - [ ] jest (if --jest passed)
  - [ ] webpack (if --webpack passed)
  - [ ] github action (lint, test, semantic-release)
  - [ ] LICENSE file
  - [ ] CONTRIBUTING file
  - [ ] README file
  - [ ] CHANGELOG file (handled by semantic-release)
  - [ ] add something to precommit to ensure package.json keys are sorted
