/* global source, describe, it, expect */

const Pattern = source('pattern');

describe('Pattern', () => {
	describe('Matching', () => {
		const tests = [
			{ rule: 'foo.{bar}.baz', input: [
				{ value: 'foo.bar.baz', matches: true, values: { bar: 'bar' }},
				{ value: 'foo.12345.baz', matches: true, values: { bar: '12345' }},
				{
					value: 'foo.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[{<;:\'"\\|,./?>}].baz',
					matches: false,
				},
				{
					value: 'foo.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.baz',
					matches: true,
					values: { bar: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' },
				},
			] },
			{ rule: 'foo.{bar:[a-zA-Z_]\\w{2,5}}.{baz}', input: [
				{ value: 'foo.bar.baz', matches: true, values: { bar: 'bar', baz: 'baz' } },
				{ value: 'foo.ba.baz', matches: false },
				{ value: 'foo.ba.12', matches: false },
				{ value: 'foo.baa.123', matches: true, values: { bar: 'baa', baz: 123 } },
				{ value: 'foo.baaa.1234', matches: true, values: { bar: 'baaa', baz: 1234 } },
				{ value: 'foo.baaaa.12345', matches: true, values: { bar: 'baaaa', baz: 12345 } },
				{ value: 'foo.baaaaa.123457', matches: true, values: { bar: 'baaaaa', baz: 123457 } },
				{ value: 'foo.baaaaaa.1234578', matches: false },
			] },
		];

		tests.forEach((suite) => {
			const pattern = new Pattern(suite.rule);

			describe(`rule "${suite.rule}"`, () => {
				suite.input.forEach((input) => {
					it(`${input.matches ? 'matches' : 'does not match'} "${input.value}`, (next) => {
						expect(pattern.matches(input.value)).to.equal(input.matches);

						if (input.values) {
							const result = Object.keys(input.values)
								.reduce((map, key) => map.set(key, input.values[key]), new Map());

							expect(pattern.getMatchedValues(input.value)).to.equal(result);
						}
						else {
							expect(pattern.getMatchedValues(input.value)).to.equal(null);
						}

						next();
					});

					if (input.values) {
						it(`satisfies "${JSON.stringify(input.values)}"`, (next) => {
							expect(pattern.satisfies(input.values)).to.equal(true);
							expect(pattern.render(input.values)).to.equal(input.value);

							next();
						});
					}
				});
			});
		});
	});

	describe('Normalizes', () => {
		const tests = [
			{ input: 'foo', expect: 'foo' },
			{ input: '{foo}', expect: '{*}' },

			{ input: 'foo.bar', expect: 'foo.bar' },
			{ input: '{foo}.bar', expect: '{*}.bar' },
			{ input: 'foo.{bar}', expect: 'foo.{*}' },
			{ input: '{foo}.{bar}', expect: '{*}.{*}' },

			{ input: 'foo.bar.baz', expect: 'foo.bar.baz' },
			{ input: '{foo}.bar.baz', expect: '{*}.bar.baz' },
			{ input: 'foo.{bar}.baz', expect: 'foo.{*}.baz' },
			{ input: 'foo.bar.{baz}', expect: 'foo.bar.{*}' },
			{ input: '{foo}.bar.{baz}', expect: '{*}.bar.{*}' },
			{ input: 'foo.{bar}.{baz}', expect: 'foo.{*}.{*}' },
			{ input: '{foo}.{bar}.baz', expect: '{*}.{*}.baz' },
			{ input: '{foo}.{bar}.{baz}', expect: '{*}.{*}.{*}' },

			{ input: '{1234}', expect: '{1234}' },
			{ input: '{1234}.foo', expect: '{1234}.foo' },
			{ input: '{1234}.{foo}', expect: '{1234}.{*}' },
		];

		tests.forEach((suite) => {
			it(`"${suite.input}" = ${suite.expect}`, (next) => {
				const pattern = new Pattern(suite.input);

				expect(pattern.normalized).to.equal(suite.expect);

				next();
			});
		});
	});
});
