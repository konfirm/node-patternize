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

	/**
	 *  Parse the given string and create a list of PatternComponents
	 *
	 *  @name      createComponents
	 *  @param     {String}  input
	 *  @return    {Array}   components
	 *  @memberof  Pattern
	 */
	static createComponents(input) {
		const property = Component.PROPERTY_PATTERN;

		return Parser
			.parse(input, [ { open: '{', close: '}', key: true } ], (a, b) => !property.test(a) && !property.test(b))
			.map((string) => new Component(string));
	}

	/**
	 *  Create a new Parser instance from string input
	 *
	 *  @name      fromString
	 *  @param     {String}   input
	 *  @return    {Pattern}  instance
	 *  @memberof  Pattern
	 */
	static fromString(input) {
		return new Pattern(this.createComponents(input));
	}
}

module.exports = Pattern;
