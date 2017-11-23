/* global source, describe, it, expect */

const Parser = source('parser');

describe('Parser', () => {
	describe('default rules', () => {
		const tests = [
			{
				input: '/foo/{bar}/baz',
				expect: [ '/foo/', '{bar}', '/baz' ],
			},
			{
				input: '/foo/\\{bar}/baz',
				expect: [ '/foo/\\{bar}/baz' ],
			},
			{
				input: '/foo/{bar:[0-9]+}/baz',
				expect: [ '/foo/', '{bar:[0-9]+}', '/baz' ],
			},
			{
				input: '/foo/{bar:[0-9]+}/{baz:[a-z]+}',
				expect: [ '/foo/', '{bar:[0-9]+}', '/', '{baz:[a-z]+}' ],
			},
			{
				input: 'foo.{bar}.baz',
				expect: [ 'foo.', '{bar}', '.baz' ],
			},
			{
				input: 'foo{bar:[0-9]+}baz',
				expect: [ 'foo', '{bar:[0-9]+}', 'baz' ],
			},
			{
				input: 'foo{bar:[a-z]{2,}[0-9]+}baz',
				expect: [ 'foo', '{bar:[a-z]{2,}[0-9]+}', 'baz' ],
			},
			{
				input: 'foo[bar]baz',
				expect: [ 'foo[bar]baz' ],
			},
			{
				input: 'foo<[bar]>baz',
				expect: [ 'foo<[bar]>baz' ],
			},
			{
				input: 'foo<[{bar}]>baz',
				expect: [ 'foo<[', '{bar}', ']>baz' ],
			},
			{
				input: 'foo<[{{qux}bar{qux}}]>baz',
				expect: [ 'foo<[', '{{qux}bar{qux}}', ']>baz' ],
			},
		];

		tests.forEach((test) => {
			it(`parses "${test.input}"`, (next) => {
				const parsed = Parser.parse(test.input);

				expect(parsed).to.be.array();
				expect(parsed).to.equal(test.expect);

				next();
			});
		});
	});

	describe('custom rules', () => {
		const arrayRules = [
			{ open: '[', close: '>', key: true },
		];
		const mapRules = Parser.rulesMap(arrayRules);

		describe('array syntax', () => {
			it('parses "hello [world>!"', (next) => {
				const parsed = Parser.parse('hello [world>!', arrayRules);

				expect(parsed).to.be.array();
				expect(parsed).to.equal(['hello ', '[world>', '!']);

				next();
			});
		});

		describe('map syntax', () => {
			it('parses "hello [world>!"', (next) => {
				const parsed = Parser.parse('hello [world>!', mapRules);

				expect(parsed).to.be.array();
				expect(parsed).to.equal(['hello ', '[world>', '!']);

				next();
			});
		});
	});

	describe('isKeyRule', () => {
		const tests = [
			{ input: false, expect: false },
			{ input: true, expect: false },
			{ input: 'foo', expect: false },
			{ input: [ 'foo' ], expect: false },
			{ input: 1, expect: false },
			{ input: null, expect: false },
			{ input: undefined, expect: false },
			{ input: { key: true }, expect: false },
			{ input: { key: false }, expect: false },
			{ input: { open: '[', close: ']' }, expect: false },
			{ input: { open: '{', close: '}' }, expect: false },
			{ input: { close: ']' }, expect: false },
			{ input: { close: '}' }, expect: false },
			{ input: { open: '[' }, expect: false },
			{ input: { open: '{' }, expect: false },
			{ input: { close: ']', key: true }, expect: false },
			{ input: { close: '}', key: true }, expect: false },
			{ input: { open: '[', key: true }, expect: false },
			{ input: { open: '{', key: true }, expect: false },
			{ input: { open: '[', close: ']', key: false }, expect: false },
			{ input: { open: '{', close: '}', key: false }, expect: false },
			{ input: { open: '[', close: ']', key: true }, expect: true },
			{ input: { open: '{', close: '}', key: true }, expect: true },
		];

		tests.forEach((test) => {
			it(`handles ${JSON.stringify(test.input)}`, (next) => {
				expect(Parser.isKeyRule(test.input)).to.equal(test.expect);

				next();
			});
		});
	});
});
