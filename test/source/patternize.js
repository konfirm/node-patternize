/* global source, describe, it, expect */

const Patternize = source('patternize');

describe('Patternize', () => {
	describe('register "foo"', () => {
		const patterns = new Patternize();

		patterns.register('foo');

		it('does not match "bar"', (next) => {
			const bar = patterns.match('bar');

			expect(bar).to.be.array();
			expect(bar).to.equal([]);

			next();
		});

		it('matches "foo"', (next) => {
			const foo = patterns.match('foo');
			expect(foo).to.be.array();
			expect(foo.length).to.equal(1);

			expect(foo[0]).to.equal({
				match: 'foo',
				value: null,
				pattern: 'foo',
			});

			next();
		});
	});

	describe('register "foo.{bar}"', () => {
		const patterns = new Patternize();

		patterns.register('foo.{bar}');

		it('does not match "bar.baz"', (next) => {
			const baz = patterns.match('bar.baz');

			expect(baz).to.be.array();
			expect(baz).to.equal([]);

			next();
		});

		it('matches "foo.baz"', (next) => {
			const foo = patterns.match('foo.baz');
			expect(foo).to.be.array();
			expect(foo.length).to.equal(1);

			expect(foo[0]).to.equal({
				match: 'foo.baz',
				value: new Map().set('bar', 'baz'),
				pattern: 'foo.{bar}',
			});

			next();
		});

		it('matches "foo.12345"', (next) => {
			const foo = patterns.match('foo.12345');
			expect(foo).to.be.array();
			expect(foo.length).to.equal(1);

			expect(foo[0]).to.equal({
				match: 'foo.12345',
				value: new Map().set('bar', '12345'),
				pattern: 'foo.{bar}',
			});

			next();
		});
	});

	describe('register "foo.{bar:[0-9]+}"', () => {
		const patterns = new Patternize();

		patterns.register('foo.{bar:[0-9]+}');

		it('does not match "bar.baz"', (next) => {
			const matched = patterns.match('bar.baz');

			expect(matched).to.be.array();
			expect(matched).to.equal([]);

			next();
		});

		it('does not match "foo.baz"', (next) => {
			const matched = patterns.match('foo.baz');

			expect(matched).to.be.array();
			expect(matched.length).to.equal(0);
			expect(matched).to.equal([]);

			next();
		});

		it('matches "foo.12345"', (next) => {
			const matched = patterns.match('foo.12345');
			expect(matched).to.be.array();
			expect(matched.length).to.equal(1);

			expect(matched[0]).to.equal({
				match: 'foo.12345',
				value: new Map().set('bar', '12345'),
				pattern: 'foo.{bar:[0-9]+}',
			});

			next();
		});
	});


	describe('orders by specificity', () => {
		describe('0-2 variables)', () => {
			const patterns = new Patternize();

			patterns.register('foo.{bar}');
			patterns.register('{foo}.{bar}');
			patterns.register('{foo}.bar');
			patterns.register('foo.bar');
			patterns.register('foo/bar');

			it('orders "foo.bar"', (next) => {
				const matched = patterns.match('foo.bar');
				const order = matched.map((match) => match.pattern);

				expect(matched.length).to.equal(4);
				expect(matched[0].value).to.equal(null);

				expect(order[0]).to.equal('foo.bar');
				expect(order[1]).to.equal('foo.{bar}');
				expect(order[2]).to.equal('{foo}.bar');
				expect(order[3]).to.equal('{foo}.{bar}');

				next();
			});
		});

		describe('0-3 variables)', () => {
			const patterns = new Patternize();

			patterns.register('{foo}/bar/{baz}');
			patterns.register('foo/{bar}/baz');
			patterns.register('foo/bar/{baz}');
			patterns.register('{foo}/{bar}/{baz}');
			patterns.register('{foo}/bar/baz');
			patterns.register('foo/bar/baz');
			patterns.register('{foo}/{bar}/baz');
			patterns.register('foo/{bar}/{baz}');

			it('orders "foo/bar/baz"', (next) => {
				const matched = patterns.match('foo/bar/baz');
				const order = matched.map((match) => match.pattern);

				expect(matched.length).to.equal(8);
				expect(matched[0].value).to.equal(null);

				expect(order[0]).to.equal('foo/bar/baz');
				expect(order[1]).to.equal('foo/bar/{baz}');
				expect(order[2]).to.equal('foo/{bar}/baz');
				expect(order[3]).to.equal('foo/{bar}/{baz}');
				expect(order[4]).to.equal('{foo}/bar/baz');
				expect(order[5]).to.equal('{foo}/bar/{baz}');
				expect(order[6]).to.equal('{foo}/{bar}/baz');
				expect(order[7]).to.equal('{foo}/{bar}/{baz}');

				next();
			});
		});

		describe('0-10 variables)', () => {
			const patterns = new Patternize();
			const input = 'aaa.bbb.ccc.ddd.eee.fff.ggg.hhh.iii.jjj';
			const parts = input.split('.');
			const collect = [ input ];


			for (let i = 0; i < parts.length; ++i) {
				collect.push(...parts.reduce((carry, value, index) => {
					const select = parts.map((value, pos) => pos < i || pos === index ? `{${value}}` : value).join('.');
					const invert = parts.map((value, pos) => pos >= i && pos !== index ? `{${value}}` : value).join('.');

					return carry.concat(select, invert);
				}, []));
			}

			const register = collect
				.filter((path, index, all) => all.indexOf(path) === index);

			register
				.forEach((path) => {
					patterns.register(path);
				});

			it(`matches and orders all ${register.length} items`, (next) => {
				const matched = patterns.match(input);
				const order = matched.map((match) => match.pattern);
				const ehm = order.slice().sort((a, b) => {
					const ua = a.replace(/\{[^\}]+\}/g, '{*}');
					const ub = b.replace(/\{[^\}]+\}/g, '{*}');

					return a < b ? -1 : +(a > b);
				});

				ehm.forEach((p, i) => {
					expect(p).to.equal(order[i]);
				});

				expect(matched.length).to.equal(register.length);
				expect(matched[0].value).to.equal(null);

				expect(order[0]).to.equal('aaa.bbb.ccc.ddd.eee.fff.ggg.hhh.iii.jjj');
				expect(order[1]).to.equal('aaa.bbb.ccc.ddd.eee.fff.ggg.hhh.iii.{jjj}');
				expect(order[2]).to.equal('aaa.bbb.ccc.ddd.eee.fff.ggg.hhh.{iii}.jjj');
				expect(order[3]).to.equal('aaa.bbb.ccc.ddd.eee.fff.ggg.hhh.{iii}.{jjj}');
				expect(order[4]).to.equal('aaa.bbb.ccc.ddd.eee.fff.ggg.{hhh}.iii.jjj');
				expect(order[5]).to.equal('aaa.bbb.ccc.ddd.eee.fff.ggg.{hhh}.iii.{jjj}');
				expect(order[6]).to.equal('aaa.bbb.ccc.ddd.eee.fff.ggg.{hhh}.{iii}.jjj');
				expect(order[7]).to.equal('aaa.bbb.ccc.ddd.eee.fff.ggg.{hhh}.{iii}.{jjj}');
				expect(order[8]).to.equal('aaa.bbb.ccc.ddd.eee.fff.{ggg}.hhh.iii.jjj');
				expect(order[9]).to.equal('aaa.bbb.ccc.ddd.eee.fff.{ggg}.hhh.{iii}.{jjj}');
				expect(order[10]).to.equal('aaa.bbb.ccc.ddd.eee.fff.{ggg}.{hhh}.iii.{jjj}');
				expect(order[11]).to.equal('aaa.bbb.ccc.ddd.eee.fff.{ggg}.{hhh}.{iii}.jjj');
				expect(order[12]).to.equal('aaa.bbb.ccc.ddd.eee.fff.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[13]).to.equal('aaa.bbb.ccc.ddd.eee.{fff}.ggg.hhh.iii.jjj');
				expect(order[14]).to.equal('aaa.bbb.ccc.ddd.eee.{fff}.ggg.{hhh}.{iii}.{jjj}');
				expect(order[15]).to.equal('aaa.bbb.ccc.ddd.eee.{fff}.{ggg}.hhh.{iii}.{jjj}');
				expect(order[16]).to.equal('aaa.bbb.ccc.ddd.eee.{fff}.{ggg}.{hhh}.iii.{jjj}');
				expect(order[17]).to.equal('aaa.bbb.ccc.ddd.eee.{fff}.{ggg}.{hhh}.{iii}.jjj');
				expect(order[18]).to.equal('aaa.bbb.ccc.ddd.eee.{fff}.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[19]).to.equal('aaa.bbb.ccc.ddd.{eee}.fff.ggg.hhh.iii.jjj');
				expect(order[20]).to.equal('aaa.bbb.ccc.ddd.{eee}.fff.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[21]).to.equal('aaa.bbb.ccc.ddd.{eee}.{fff}.ggg.{hhh}.{iii}.{jjj}');
				expect(order[22]).to.equal('aaa.bbb.ccc.ddd.{eee}.{fff}.{ggg}.hhh.{iii}.{jjj}');
				expect(order[23]).to.equal('aaa.bbb.ccc.ddd.{eee}.{fff}.{ggg}.{hhh}.iii.{jjj}');
				expect(order[24]).to.equal('aaa.bbb.ccc.ddd.{eee}.{fff}.{ggg}.{hhh}.{iii}.jjj');
				expect(order[25]).to.equal('aaa.bbb.ccc.ddd.{eee}.{fff}.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[26]).to.equal('aaa.bbb.ccc.{ddd}.eee.fff.ggg.hhh.iii.jjj');
				expect(order[27]).to.equal('aaa.bbb.ccc.{ddd}.eee.{fff}.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[28]).to.equal('aaa.bbb.ccc.{ddd}.{eee}.fff.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[29]).to.equal('aaa.bbb.ccc.{ddd}.{eee}.{fff}.ggg.{hhh}.{iii}.{jjj}');
				expect(order[30]).to.equal('aaa.bbb.ccc.{ddd}.{eee}.{fff}.{ggg}.hhh.{iii}.{jjj}');
				expect(order[31]).to.equal('aaa.bbb.ccc.{ddd}.{eee}.{fff}.{ggg}.{hhh}.iii.{jjj}');
				expect(order[32]).to.equal('aaa.bbb.ccc.{ddd}.{eee}.{fff}.{ggg}.{hhh}.{iii}.jjj');
				expect(order[33]).to.equal('aaa.bbb.ccc.{ddd}.{eee}.{fff}.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[34]).to.equal('aaa.bbb.{ccc}.ddd.eee.fff.ggg.hhh.iii.jjj');
				expect(order[35]).to.equal('aaa.bbb.{ccc}.ddd.{eee}.{fff}.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[36]).to.equal('aaa.bbb.{ccc}.{ddd}.eee.{fff}.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[37]).to.equal('aaa.bbb.{ccc}.{ddd}.{eee}.fff.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[38]).to.equal('aaa.bbb.{ccc}.{ddd}.{eee}.{fff}.ggg.{hhh}.{iii}.{jjj}');
				expect(order[39]).to.equal('aaa.bbb.{ccc}.{ddd}.{eee}.{fff}.{ggg}.hhh.{iii}.{jjj}');
				expect(order[40]).to.equal('aaa.bbb.{ccc}.{ddd}.{eee}.{fff}.{ggg}.{hhh}.iii.{jjj}');
				expect(order[41]).to.equal('aaa.bbb.{ccc}.{ddd}.{eee}.{fff}.{ggg}.{hhh}.{iii}.jjj');
				expect(order[42]).to.equal('aaa.bbb.{ccc}.{ddd}.{eee}.{fff}.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[43]).to.equal('aaa.{bbb}.ccc.ddd.eee.fff.ggg.hhh.iii.jjj');
				expect(order[44]).to.equal('aaa.{bbb}.ccc.{ddd}.{eee}.{fff}.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[45]).to.equal('aaa.{bbb}.{ccc}.ddd.{eee}.{fff}.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[46]).to.equal('aaa.{bbb}.{ccc}.{ddd}.eee.{fff}.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[47]).to.equal('aaa.{bbb}.{ccc}.{ddd}.{eee}.fff.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[48]).to.equal('aaa.{bbb}.{ccc}.{ddd}.{eee}.{fff}.ggg.{hhh}.{iii}.{jjj}');
				expect(order[49]).to.equal('aaa.{bbb}.{ccc}.{ddd}.{eee}.{fff}.{ggg}.hhh.{iii}.{jjj}');
				expect(order[50]).to.equal('aaa.{bbb}.{ccc}.{ddd}.{eee}.{fff}.{ggg}.{hhh}.iii.{jjj}');
				expect(order[51]).to.equal('aaa.{bbb}.{ccc}.{ddd}.{eee}.{fff}.{ggg}.{hhh}.{iii}.jjj');
				expect(order[52]).to.equal('aaa.{bbb}.{ccc}.{ddd}.{eee}.{fff}.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[53]).to.equal('{aaa}.bbb.ccc.ddd.eee.fff.ggg.hhh.iii.jjj');
				expect(order[54]).to.equal('{aaa}.bbb.ccc.ddd.eee.fff.ggg.hhh.iii.{jjj}');
				expect(order[55]).to.equal('{aaa}.bbb.ccc.ddd.eee.fff.ggg.hhh.{iii}.jjj');
				expect(order[56]).to.equal('{aaa}.bbb.ccc.ddd.eee.fff.ggg.{hhh}.iii.jjj');
				expect(order[57]).to.equal('{aaa}.bbb.ccc.ddd.eee.fff.{ggg}.hhh.iii.jjj');
				expect(order[58]).to.equal('{aaa}.bbb.ccc.ddd.eee.{fff}.ggg.hhh.iii.jjj');
				expect(order[59]).to.equal('{aaa}.bbb.ccc.ddd.{eee}.fff.ggg.hhh.iii.jjj');
				expect(order[60]).to.equal('{aaa}.bbb.ccc.{ddd}.eee.fff.ggg.hhh.iii.jjj');
				expect(order[61]).to.equal('{aaa}.bbb.{ccc}.ddd.eee.fff.ggg.hhh.iii.jjj');
				expect(order[62]).to.equal('{aaa}.bbb.{ccc}.{ddd}.{eee}.{fff}.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[63]).to.equal('{aaa}.{bbb}.ccc.ddd.eee.fff.ggg.hhh.iii.jjj');
				expect(order[64]).to.equal('{aaa}.{bbb}.ccc.ddd.eee.fff.ggg.hhh.iii.{jjj}');
				expect(order[65]).to.equal('{aaa}.{bbb}.ccc.ddd.eee.fff.ggg.hhh.{iii}.jjj');
				expect(order[66]).to.equal('{aaa}.{bbb}.ccc.ddd.eee.fff.ggg.{hhh}.iii.jjj');
				expect(order[67]).to.equal('{aaa}.{bbb}.ccc.ddd.eee.fff.{ggg}.hhh.iii.jjj');
				expect(order[68]).to.equal('{aaa}.{bbb}.ccc.ddd.eee.{fff}.ggg.hhh.iii.jjj');
				expect(order[69]).to.equal('{aaa}.{bbb}.ccc.ddd.{eee}.fff.ggg.hhh.iii.jjj');
				expect(order[70]).to.equal('{aaa}.{bbb}.ccc.{ddd}.eee.fff.ggg.hhh.iii.jjj');
				expect(order[71]).to.equal('{aaa}.{bbb}.ccc.{ddd}.{eee}.{fff}.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[72]).to.equal('{aaa}.{bbb}.{ccc}.ddd.eee.fff.ggg.hhh.iii.jjj');
				expect(order[73]).to.equal('{aaa}.{bbb}.{ccc}.ddd.eee.fff.ggg.hhh.iii.{jjj}');
				expect(order[74]).to.equal('{aaa}.{bbb}.{ccc}.ddd.eee.fff.ggg.hhh.{iii}.jjj');
				expect(order[75]).to.equal('{aaa}.{bbb}.{ccc}.ddd.eee.fff.ggg.{hhh}.iii.jjj');
				expect(order[76]).to.equal('{aaa}.{bbb}.{ccc}.ddd.eee.fff.{ggg}.hhh.iii.jjj');
				expect(order[77]).to.equal('{aaa}.{bbb}.{ccc}.ddd.eee.{fff}.ggg.hhh.iii.jjj');
				expect(order[78]).to.equal('{aaa}.{bbb}.{ccc}.ddd.{eee}.fff.ggg.hhh.iii.jjj');
				expect(order[79]).to.equal('{aaa}.{bbb}.{ccc}.ddd.{eee}.{fff}.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[80]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.eee.fff.ggg.hhh.iii.jjj');
				expect(order[81]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.eee.fff.ggg.hhh.iii.{jjj}');
				expect(order[82]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.eee.fff.ggg.hhh.{iii}.jjj');
				expect(order[83]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.eee.fff.ggg.{hhh}.iii.jjj');
				expect(order[84]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.eee.fff.{ggg}.hhh.iii.jjj');
				expect(order[85]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.eee.{fff}.ggg.hhh.iii.jjj');
				expect(order[86]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.eee.{fff}.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[87]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.fff.ggg.hhh.iii.jjj');
				expect(order[88]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.fff.ggg.hhh.iii.{jjj}');
				expect(order[89]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.fff.ggg.hhh.{iii}.jjj');
				expect(order[90]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.fff.ggg.{hhh}.iii.jjj');
				expect(order[91]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.fff.{ggg}.hhh.iii.jjj');
				expect(order[92]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.fff.{ggg}.{hhh}.{iii}.{jjj}');
				expect(order[93]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.{fff}.ggg.hhh.iii.jjj');
				expect(order[94]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.{fff}.ggg.hhh.iii.{jjj}');
				expect(order[95]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.{fff}.ggg.hhh.{iii}.jjj');
				expect(order[96]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.{fff}.ggg.{hhh}.iii.jjj');
				expect(order[97]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.{fff}.ggg.{hhh}.{iii}.{jjj}');
				expect(order[98]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.{fff}.{ggg}.hhh.iii.jjj');
				expect(order[99]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.{fff}.{ggg}.hhh.iii.{jjj}');
				expect(order[100]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.{fff}.{ggg}.hhh.{iii}.jjj');
				expect(order[101]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.{fff}.{ggg}.hhh.{iii}.{jjj}');
				expect(order[102]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.{fff}.{ggg}.{hhh}.iii.jjj');
				expect(order[103]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.{fff}.{ggg}.{hhh}.iii.{jjj}');
				expect(order[104]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.{fff}.{ggg}.{hhh}.{iii}.jjj');
				expect(order[105]).to.equal('{aaa}.{bbb}.{ccc}.{ddd}.{eee}.{fff}.{ggg}.{hhh}.{iii}.{jjj}');

				next();
			});
		});
	});
});
