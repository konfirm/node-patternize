/* global source, describe, it, expect */

const Emitter = source('emitter');
const Patternize = source('patternize');

describe('Emitter', () => {
	describe('constructor', () => {
		it('uses a provided Patternize instance', (next) => {
			const patterns = new Patternize();
			const emitterA = new Emitter(patterns);
			const emitterB = new Emitter(patterns);
			const result = [];

			//  test whether any subscription to emitterA affects emiiterB
			emitterA.on('foo.bar.baz', () => {
				result.push('A');
			});
			emitterB.on('foo.bar.baz', () => {
				result.push('B');
			});

			emitterA.emit('foo.bar.baz');

			setTimeout(() => {
				expect(result.length).to.equal(2);
				expect(result).to.equal(['A', 'B']);

				next();
			}, 100);
		});

		it('generates unique Patternize instances if none provided', (next) => {
			const emitterA = new Emitter();
			const emitterB = new Emitter();
			const result = [];

			//  test whether any subscription to emitterA affects emiiterB
			emitterA.on('foo.bar.baz', () => {
				result.push('A');
			});
			emitterB.on('foo.bar.baz', () => {
				result.push('B');
			});

			emitterA.emit('foo.bar.baz');

			setTimeout(() => {
				expect(result.length).to.equal(1);
				expect(result).to.equal(['A']);

				next();
			}, 100);
		});

		it('throws error if a true-ish value other than a Patternize is provided', (next) => {
			expect(() => new Emitter(true)).to.throw(Error, /^Expected Patternize instance/);
			expect(() => new Emitter('hello')).to.throw(Error, /^Expected Patternize instance/);
			expect(() => new Emitter(Infinity)).to.throw(Error, /^Expected Patternize instance/);
			expect(() => new Emitter(['hello'])).to.throw(Error, /^Expected Patternize instance/);
			expect(() => new Emitter({hello: 'world'})).to.throw(Error, /^Expected Patternize instance/);

			next();
		});
	});

	describe('subscriptions and emissions', () => {
		it('fires "once" subscriptions only once', (next) => {
			const emitter = new Emitter();
			let count = 0;

			emitter.once('foo.bar.baz', () => {
				++count;
			});

			emitter.emit('foo.bar.baz');
			emitter.emit('foo.bar.baz');

			setTimeout(() => {
				expect(count).to.equal(1);

				next();
			}, 100);
		});

		it('fires until removed', (next) => {
			let count = 0;
			const emitter = new Emitter();
			const handle = (subject) => {
				if (++count < 10) {
					return emitter.emit(subject.input);
				}

				const dropped = emitter.off(subject.input, handle);
				emitter.emit(subject.input);

				expect(dropped).to.be.array();
				expect(dropped.length).to.equal(1);
				expect(dropped[0]).to.equal(handle);

				setTimeout(() => {
					expect(count).to.equal(10);

					next();
				}, 100);
			};

			emitter.on('foo.bar.baz', handle);
			emitter.emit('foo.bar.baz');
		});

		it('removes exact matches, nothing else', (next) => {
			const emitter = new Emitter();
			let count = 0;
			const removal = () => ++count;
			const keeper = () => count += 100;

			emitter.on('hello.world', removal);
			emitter.on('hello.world', keeper);

			setTimeout(() => {
				const removed = emitter.off('hello.world', removal);

				expect(count).to.equal(101);
				expect(removed).to.be.array();
				expect(removed.length).to.equal(1);
				expect(removed).to.equal([removal]);

				emitter.emit('hello.world');

				setTimeout(() => {
					expect(count).to.equal(201);

					next();
				}, 100);
			}, 100);

			emitter.emit('hello.world');
		});
	});
});
