const Patternize = require('./source/patternize');
const Pattern = require('./source/pattern');
const PatternComponent = require('./source/pattern/component');
const Emitter = require('./source/emitter');

const patternize = new Patternize();

module.exports = {
	Patternize,
	Pattern,
	PatternComponent,
	Emitter,

	patternize,
	emitter: new Emitter(patternize),
};
