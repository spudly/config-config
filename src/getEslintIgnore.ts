import {Options} from './utils';

const getEslintIgnore = (_options: Options) => ['node_modules', 'build'];

export default getEslintIgnore;
