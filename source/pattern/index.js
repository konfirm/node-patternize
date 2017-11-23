const Parser = require('../parser');
const Component = require('./component');

const storage = new WeakMap();

/**
 *  Configure a pattern handler
 *
 *  @class Pattern
 */
class Pattern {
	/**
	 *  Creates an instance of Pattern
	 *
	 *  @param     {String}  input
	 *  @memberof  Pattern
	 */
	constructor(components) {
		storage.set(this, {
			components,
			string: components.map((comp) => comp.string).join(''),
			keys: components.map((comp) => comp.key).filter((key) => key),
			normal: components.map((comp) => comp.key ? '{*}' : comp.string).join(''),
			expression: new RegExp(`^${components.map((comp) => comp.pattern).join('')}$`),
		});
	}

	/**
	 *  Test whether the given string matches the pattern
	 *
	 *  @name      matches
	 *  @param     {String}   input
	 *  @return    {Boolean}  matches
	 *  @memberof  Pattern
	 */
	matches(input) {
		const { expression } = storage.get(this);

		return expression.test(String(input));
	}

	/**
	 *  Test whether the given object satisfies the pattern
	 *
	 *  @name      satisfies
	 *  @param     {Object}   input
	 *  @return    {Boolean}  satisfies
	 *  @memberof  Pattern
	 */
	satisfies(input) {
		const { components } = storage.get(this);
		const keys = components.filter((comp) => comp.key);
		const length = keys.length;

		return components
			.filter((comp) => comp.key in input && comp.regex.test(input[comp.key])).length === length;
	}

	/**
	 *  Extract the given string into a Map containing all the pattern keys
	 *
	 *  @name      getMatchedValues
	 *  @param     {String}  input
	 *  @return    {Map}     values
	 *  @memberof  Pattern
	 */
	getMatchedValues(input) {
		const { expression, keys } = storage.get(this);
		const match = (String(input).match(expression) || []).slice(1);

		return match.length ? keys.reduce((map, key, index) => map.set(key, match[index]), new Map()) : null;
	}

	/**
	 *  Render the pattern into a string containing the variables provided
	 *
	 *  @name      render
	 *  @param     {Object}  input
	 *  @return    {String}  rendered
	 *  @memberof  Pattern
	 */
	render(input) {
		return storage.get(this).components
			.map((comp) => comp.key ? input[comp.key] : comp.string)
			.join('');
	}

	equals(compare) {
		return compare instanceof Pattern ? compare.string === this.string : String(compare) === this.string;
	}

	same(compare) {
		const pattern = compare instanceof Pattern ? compare : new Pattern(String(compare));

		return
	}

	/**
	 *  Get the string used to created the Pattern instance
	 *
	 *  @name      string
	 *  @readonly
	 *  @memberof  Pattern
	 */
	get string() {
		return storage.get(this).string;
	}

	/**
	 *  Get the normalized version of the string used to created the Pattern instance
	 *
	 *  @name      normalized
	 *  @readonly
	 *  @memberof  Pattern
	 */
	get normalized() {
		return storage.get(this).normal;
	}

	static fromString(input, raw=false) {
		const chunks = Parser.parse(input, [ { open: '{', close: '}', key: true } ]);
		const property = /^\{([a-zA-Z]\w*)(?::(.+))?\}$/;
		const components = chunks
			//  TODO: shorten this code
			.reduce((carry, string) => {
				const prev = carry.length - 1;

				if (prev >= 0 && !property.test(carry[prev]) && !property.test(string)) {
					carry[prev] += string;

					return carry;
				}

				return carry.concat(string);
			}, [])
			.map((string) => new Component(string));

		return raw ? components : new Pattern(components);
	}
}

module.exports = Pattern;
