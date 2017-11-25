const Patternize = require('./source/patternize');
const Emitter = require('./source/emitter');
const Pattern = require('./source/pattern');

const patternize = new Patternize();

module.exports = {
	Patternize,
	Pattern,
	Emitter,

	patternize,
	emitter: new Emitter(patternize),
};
