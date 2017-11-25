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

	/**
	 *  Register a pattern for matching, if the same pattern already exists
	 *  the existing one will be returned and no new one is added
	 *
	 *  @name      register
	 *  @param     {Pattern|String}  pattern
	 *  @param     {Boolean}         [force=false]
	 *  @returns   {Pattern}         registered
	 *  @memberof  Patternize
	 */
	register(pattern, force=false) {
		const { list } = storage.get(this);
		const candidate = this.find(pattern);

		if (force || !candidate.length) {
			candidate.push(pattern instanceof Pattern ? pattern : Pattern.fromString(pattern));
			list.push(candidate[0]);
		}

		return candidate.pop();
	}

	/**
	 *  Match the string input to obtain a list of matching patterns
	 *
	 *  @name      match
	 *  @param     {String} input
	 *  @returns   {Array}  patterns
	 *  @memberof  Patternize
	 */
	match(input) {
		const satisfy = typeof input === 'object';

		return storage.get(this).list
			.filter((pattern) => satisfy ? pattern.satisfies(input) : pattern.matches(input))
			.sort((a, b) => {
				const na = a.normalized;
				const nb = b.normalized;

				return na < nb ? -1 : +(na > nb);
			});
	}

	/**
	 *  Match the input to obtain the most specific pattern
	 *
	 *  @name      matchOne
	 *  @param     {String|Object}      input
	 *  @returns   {Pattern|undefined}  matched pattern
	 *  @memberof  Patternize
	 */
	matchOne(input) {
		return this.match(input).shift();
	}

	/**
	 *  Find a pattern matching the provided input.
	 *
	 *  @name      find
	 *  @param     {Pattern|Array|String}  pattern
	 *  @param     {Boolean}               [similar=false]
	 *  @returns   {Array}                 patterns
	 *  @memberof  Patternize
	 */
	find(pattern, similar=false) {
		const compare = Pattern.getComponentList(pattern);

		return storage.get(this).list
			.filter((pattern) => similar ? pattern.same(compare) : pattern.equals(compare));
	}
}

module.exports = Patternize;
