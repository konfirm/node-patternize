/* global source, describe, it, expect */

const Patternize = source('patternize');
const Pattern = source('pattern');

describe('Patternize', () => {
	describe('register "foo"', () => {
		const patterns = new Patternize();
		const registered = patterns.register('foo');
		const dupe = patterns.register('foo');
		const forced = patterns.register('foo', true);

		it('does not register another "foo" unless forced', (next) => {
			expect(dupe === registered).to.equal(true);
			expect(forced === registered).to.equal(false);

			next();
		});

		it('does not match "bar"', (next) => {
			const bars = patterns.match('bar');
			const bar = patterns.matchOne('bar');

			expect(bars).to.be.array();
			expect(bars).to.equal([]);

			expect(bar).to.equal(undefined);

			next();
		});

		it('matches "foo"', (next) => {
			const foos = patterns.match('foo');
			const foo = patterns.matchOne('foo');

			expect(foos).to.be.array();
			expect(foos.length).to.equal(2);

			expect(foo).to.equal(registered);
			expect(foos[0]).to.equal(registered);
			expect(foos[1]).to.equal(forced);

			next();
		});
	});

	describe('register Pattern("foo")', () => {
		const patterns = new Patternize();
		const pattern = Pattern.fromString('foo');
		const registered = patterns.register(pattern);
		const dupe = patterns.register(pattern);
		const forced = patterns.register(pattern, true);

		it('does not register another "foo" unless forced', (next) => {
			expect(dupe === registered).to.equal(true);
			expect(forced === registered).to.equal(true);

			next();
		});
	});

	describe('register "foo.{bar}"', () => {
		const patterns = new Patternize();
		const registered = patterns.register('foo.{bar}');

		it('does not match "bar.baz"', (next) => {
			const bazs = patterns.match('bar.baz');
			const baz = patterns.matchOne('bar.baz');

			expect(bazs).to.be.array();
			expect(bazs).to.equal([]);

			expect(baz).to.equal(undefined);

			next();
		});

		it('matches "foo.baz"', (next) => {
			const foos = patterns.match('foo.baz');
			const foo = patterns.matchOne('foo.baz');

			expect(foos).to.be.array();
			expect(foos.length).to.equal(1);

			expect(foo).to.equal(registered);
			expect(foos[0]).to.equal(registered);

			next();
		});

		it('matches "foo.12345"', (next) => {
			const foos = patterns.match('foo.12345');
			const foo = patterns.matchOne('foo.12345');

			expect(foos).to.be.array();
			expect(foos.length).to.equal(1);

			expect(foo).to.equal(registered);
			expect(foos[0]).to.equal(registered);

			next();
		});

		it('matches {bar: "abcde"}', (next) => {
			const value = { bar: 'abcde' };
			const foos = patterns.match(value);
			const foo = patterns.matchOne(value);

			expect(foos).to.be.array();
			expect(foos.length).to.equal(1);

			expect(foo).to.equal(registered);
			expect(foos[0]).to.equal(registered);

			next();
		});
	});

	describe('register "foo.{bar:[0-9]+}"', () => {
		const patterns = new Patternize();
		const registered = patterns.register('foo.{bar:[0-9]+}');

		it('does not match "bar.baz"', (next) => {
			const matched = patterns.match('bar.baz');
			const one = patterns.matchOne('bar.baz');

			expect(matched).to.be.array();
			expect(matched).to.equal([]);

			expect(one).to.equal(undefined);

			next();
		});

		it('does not match "foo.baz"', (next) => {
			const matched = patterns.match('foo.baz');
			const one = patterns.matchOne('foo.bar');

			expect(matched).to.be.array();
			expect(matched.length).to.equal(0);
			expect(matched).to.equal([]);

			expect(one).to.equal(undefined);

			next();
		});

		it('matches "foo.12345"', (next) => {
			const matched = patterns.match('foo.12345');
			const one = patterns.matchOne('foo.12345');

			expect(matched).to.be.array();
			expect(matched.length).to.equal(1);

			expect(one).to.equal(registered);
			expect(matched[0]).to.equal(registered);

			next();
		});
	});

	describe('find patterns', () => {
		const patterns = new Patternize();

		patterns.register('foo.bar');
		patterns.register('{foo}.{bar}');
		patterns.register('{greet}.{audience}');

		it('finds "foo.bar"', (next) => {
			const found = patterns.find('foo.bar');

			expect(found).to.be.array();
			expect(found.length).to.equal(1);
			expect(found[0].string).to.equal('foo.bar');

			next();
		});

		it('finds "{foo}.{bar}"', (next) => {
			const found = patterns.find('{foo}.{bar}');

			expect(found).to.be.array();
			expect(found.length).to.equal(1);
			expect(found[0].string).to.equal('{foo}.{bar}');

			next();
		});

		it('finds "{foo}.{bar}" and "{greet}.{audience}', (next) => {
			const found = patterns.find('{foo}.{bar}', true);

			expect(found).to.be.array();
			expect(found.length).to.equal(2);
			expect(found[0].string).to.equal('{foo}.{bar}');
			expect(found[1].string).to.equal('{greet}.{audience}');

			next();
		});
	});

	describe('orders correctly', () => {
		describe('0-2 variables)', () => {
			const patterns = new Patternize();
			const greedy = patterns.register('foo.bar');
			const registered = [
				patterns.register('foo.{bar}'),
				patterns.register('{foo}.{bar}'),
				patterns.register('{foo}.bar'),
				greedy,
				patterns.register('foo/bar'),
			];

			it('orders "foo.bar"', (next) => {
				const matched = patterns.match('foo.bar');
				const one = patterns.matchOne('foo.bar');
				const order = matched.map((match) => match.string);

				expect(matched.length).to.equal(4);
				expect(matched[0]).to.equal(greedy);

				expect(one).to.equal(greedy);

				expect(order[0]).to.equal('foo.bar');
				expect(order[1]).to.equal('foo.{bar}');
				expect(order[2]).to.equal('{foo}.bar');
				expect(order[3]).to.equal('{foo}.{bar}');

				next();
			});
		});

		describe('0-3 variables)', () => {
			const patterns = new Patternize();
			const greedy = patterns.register('foo/bar/baz');
			const registered = [
				patterns.register('{foo}/bar/{baz}'),
				patterns.register('foo/{bar}/baz'),
				patterns.register('foo/bar/{baz}'),
				patterns.register('{foo}/{bar}/{baz}'),
				patterns.register('{foo}/bar/baz'),
				greedy,
				patterns.register('{foo}/{bar}/baz'),
				patterns.register('foo/{bar}/{baz}'),
			];

			it('orders "foo/bar/baz"', (next) => {
				const matched = patterns.match('foo/bar/baz');
				const one = patterns.matchOne('foo/bar/baz');
				const order = matched.map((match) => match.string);

				expect(matched.length).to.equal(8);
				expect(matched[0]).to.equal(greedy);

				expect(one).to.equal(greedy);

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
			const greedy = patterns.register(input);
			const parts = input.split('.');
			const collect = [];


			for (let i = 0; i < parts.length; ++i) {
				collect.push(...parts.reduce((carry, value, index) => {
					const select = parts.map((value, pos) => pos < i || pos === index ? `{${value}}` : value).join('.');
					const invert = parts.map((value, pos) => pos >= i && pos !== index ? `{${value}}` : value).join('.');

					return carry.concat(select, invert);
				}, []));
			}

			const registered = collect
				.filter((path, index, all) => path !== input && all.indexOf(path) === index)
				.map((path) => patterns.register(path))
				.concat(greedy);

			it(`matches and orders all ${registered.length} items`, (next) => {
				const matched = patterns.match(input);
				const one = patterns.matchOne(input);
				const order = matched.map((match) => match.string);
				const ehm = order.slice().sort((a, b) => {
					const ua = a.replace(/\{[^\}]+\}/g, '{*}');
					const ub = b.replace(/\{[^\}]+\}/g, '{*}');

					return a < b ? -1 : +(a > b);
				});

				ehm.forEach((p, i) => {
					expect(p).to.equal(order[i]);
				});

				expect(matched.length).to.equal(registered.length);
				expect(matched[0]).to.equal(greedy);
				expect(one).to.equal(greedy);

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
