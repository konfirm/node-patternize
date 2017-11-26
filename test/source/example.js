/* global source, describe, it, expect */

const Patternize = source('patternize');
const Pattern = source('pattern');

describe('Examples', () => {
	const samples = [
		{
			input: 'user.{id:[0-9]{3,12}}',
			tests: [
				{ input: 'user.123', expect: true , values: { id: '123' } },
				{ input: 'user.987262725682', expect: true, values: { id: '987262725682' } },
				{ input: 'user.jane', expect: false },
				{ input: 'user.john', expect: false },
			],
		},
		{
			input: 'date/{year:20[0-2][0-9]}',
			tests: [
				{ input: 'date/2017', expect: true, values: { year: '2017' } },
				{ input: 'date/2029', expect: true, values: { year: '2019' } },
				{ input: 'date/1999', expect: false },
				{ input: 'date/2030', expect: false },
			],
		},
		{
			input: 'date/{year:20[0-2][0-9]}-{month:0[1-9]|1[0-2]}-{day:0[1-9]|[1-2][0-9]|3[01]}',
			tests: [
				{ input: 'date/2017-11-26', expect: true, values: { year: '2017', month: '11', day: '26'} },
				{ input: 'date/2029-01-01', expect: true, values: { year: '2029', month: '01', day: '01'} },
				{ input: 'date/2029-1-1', expect: false },
				{ input: 'date/1970-01-01', expect: false },
				{ input: 'date/2017-1-2', expect: false },
				{ input: 'date/2030-12-12', expect: false },
				{ input: 'date/1999-03-04', expect: false },
			],
		},
	];

	samples.forEach((sample) => {
		it(`matches "${sample.input}"`, (next) => {
			const patterns = new Patternize();
			const registered = patterns.register(sample.input);

			sample.tests.forEach((test) => {
				const matched = patterns.matchOne(test.input);

				if (test.expect) {
					const map = Object.keys(test.values)
						.reduce((map, key) => map.set(key, test.values[key]), new Map());

					expect(matched).to.equal(registered);
					expect(matched.string).to.equal(sample.input);
					expect(matched.getMatchedValues(test.input)).to.equal(map);
				}
				else {
					expect(matched).to.be.undefined();
				}
			});

			next();
		});
	});
});
