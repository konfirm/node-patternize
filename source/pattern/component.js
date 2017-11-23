const Expressionist = require('@konfirm/expressionist');
const storage = new WeakMap();

class PatternComponent {
	constructor(string) {
		const match = string.match(this.constructor.PROPERTY_PATTERN);
		const pattern =  match ? `(${Expressionist.ungroup(match[2] || '\\w+')})` : Expressionist.escape(string);

		storage.set(this, {
			string,
			key: match ? match[1] : null,
			pattern,
			regex: new RegExp(pattern),
		});
	}

	/**
	 *  Obtain the pattern to determine pattern keys
	 *
	 *  @readonly
	 *  @static
	 *  @memberof PatternComponent
	 */
	static get PROPERTY_PATTERN() {
		return /^\{([a-zA-Z]\w*)(?::(.+))?\}$/;
	}

	/**
	 *  Obtain the string value
	 *
	 *  @name      string
	 *  @return    {String}  value
	 *  @readonly
	 *  @memberof  PatternComponent
	 */
	get string() {
		return storage.get(this).string;
	}

	/**
	 *  Obtain the key value
	 *
	 *  @name      key
	 *  @return    {String}  key
	 *  @readonly
	 *  @memberof  PatternComponent
	 */
	get key() {
		return storage.get(this).key;
	}

	/**
	 *  Obtain the pattern value
	 *
	 *  @name      pattern
	 *  @return    {String}  pattern
	 *  @readonly
	 *  @memberof  PatternComponent
	 */
	get pattern() {
		return storage.get(this).pattern;
	}

	/**
	 *  Obtain the regex value
	 *
	 *  @name      regex
	 *  @return    {RegExp}  value
	 *  @readonly
	 *  @memberof  PatternComponent
	 */
	get regex() {
		return storage.get(this).regex;
	}

}

module.exports = PatternComponent;
