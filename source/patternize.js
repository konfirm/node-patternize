const Pattern = require('./pattern');
const storage = new WeakMap();

/**
 *  Patternize, register and find Patterns
 *
 *  @class Patternize
 */
class Patternize {
	/**
	 *  Creates an instance of Patternize.
	 *
	 *  @memberof Patternize
	 */
	constructor() {
		storage.set(this, { list: [] });
	}

	register(pattern) {
		const { list } = storage.get(this);
		const instance = pattern instanceof Pattern ? pattern : Pattern.fromString(pattern);

		if (!this.contains(instance)) {
			list.push(instance);
		}

		return instance;
	}

	contains(compare, similar=true) {
		return storage.get(this).list
			.filter((pattern) => similar ? pattern.same(compare) : pattern.equals(compare))
			.length > 0;
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

	matchOne(input) {
		return this.match(input).shift();
	}
}

module.exports = Patternize;
