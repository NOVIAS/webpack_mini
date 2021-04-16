const Compiler = require('./Compiler');
const options = require('../webpack.config');

const compiler = new Compiler(options);

compiler.run();
