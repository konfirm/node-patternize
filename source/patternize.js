const Pattern = require('./pattern');
const storage = new WeakMap();

class Patternize {
	constructor() {
		storage.set(this, { list: [] });
	}

	// on(input, handle) {
	// 	const { list } = storage.get(this);

	// 	list.push({ input, pattern: new Pattern(input), handle, limit: Infinity });
	// }

	// once(input, handle) {
	// 	const { list } = storage.get(this);

	// 	list.push({ input, pattern: new Pattern(input), handle, limit: 1 });
	// }

	// off(input, handle) {
	// 	const { list } = storage.get(this);

	// 	return list
	// 		.reduce((carry, item, index) => {
	// 			const matches = (!input || item.input === input) && (!handle || item.handle === handle);

	// 			return (matches ? [index] : []).concat(carry);
	// 		}, [])
	// 		.reduce((carry, index) => list.splice(index, 1).concat(carry), []);
	// }

	// trigger(input, ...args) {
	// 	const collect = [];

	// 	return storage.get(this).list
	// 		.filter((item) => item.pattern.matches(input))
	// 		.sort((a, b) => {
	// 			let va = a.pattern.specificity;
	// 			let sb = b.pattern.specificity;

	// 			return sa > sb ? -1 : +(sa < sb);
	// 		})
	// 		.reduce((promise, item) => promise.then((result) => new Promise((resolve, reject) => {
	// 		})), Promise.resolve());
	// }

	register(string) {
		const { list } = storage.get(this);
		const pattern = Pattern.fromString(string);

		list.push(pattern);
	}

	match(input) {
		return storage.get(this).list
			.filter((pattern) => pattern.matches(input))
			.sort((a, b) => {
				const na = a.normalized;
				const nb = b.normalized;

				return na < nb ? -1 : +(na > nb);
			})
			.map((pattern) => ({
				match: input,
				value: pattern.getMatchedValues(input),
				pattern: pattern.string,
			}));
	}
}

module.exports = Patternize;
