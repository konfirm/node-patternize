/* global source, describe, it, expect */

const Patternize = source('patternize');
const Pattern = source('pattern');
const Emitter = source('emitter');

const main = require('../../index.js');

describe('Main', () => {
	describe('Class exports', () => {
		it('Patternize', (next) => {
			expect(main).to.contain('Patternize');
			expect(main.Patternize).to.equal(Patternize);

			next();
		});

		it('Pattern', (next) => {
			expect(main).to.contain('Pattern');
			expect(main.Pattern).to.equal(Pattern);

			next();
		});

		it('Emitter', (next) => {
			expect(main).to.contain('Emitter');
			expect(main.Emitter).to.equal(Emitter);

			next();
		});
	});

	describe('Instance exports', () => {
		it('patternize', (next) => {
			expect(main).to.contain('patternize');
			expect(main.patternize).to.be.instanceof(Patternize);

			next();
		});

		it('emitter', (next) => {
			expect(main).to.contain('emitter');
			expect(main.emitter).to.be.instanceof(Emitter);

			next();
		});
	});
});
