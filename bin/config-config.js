#!/usr/bin/env node
const configConfig = require('../build').default;

configConfig(process.cwd(), process.argv.slice(2));
