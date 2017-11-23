/**
 *  Parser
 *
 *  @class Parser
 */
class Parser {
	/**
	 *  A default set of rules to parse
	 *
	 *  @name      RULES
	 *  @return    {Map}  rules
	 *  @readonly
	 *  @memberof  Parser
	 */
	static get RULES() {
		return this.rulesMap([
			{ open: '{', close: '}', key: true },
			{ open: '[', close: ']' },
			{ open: '<', close: '>' },
			{ open: '(', close: ')' },
		]);
	}

	/**
	 *  Convert an array of rules into a Map
	 *
	 *  @name      rulesMap
	 *  @param     {Array}  rules
	 *  @return    {Map}    rules
	 *  @memberof  Parser
	 */
	static rulesMap(rules) {
		return rules.reduce((map, rule) => map.set(rule.open, rule), new Map());
	}

	/**
	 *  Determine whether given value applies as a rule object with a key
	 *  property set to true(-ish)
	 *
	 *  @name      isKeyRule
	 *  @param     {any} rule
	 *  @return    {Boolean}  is rule
	 *  @memberof  Parser
	 */
	static isKeyRule(rule) {
		const keys = ['key', 'open', 'close'];

		return typeof rule === 'object' && rule !== null && 'key' in rule && 'open' in rule && 'close' in rule && rule.key;
	}

	/**
	 *  Count the number of key rules in the list
	 *
	 *  @name      keyRuleCount
	 *  @param     {Array}   expect
	 *  @return    {Number}  count
	 *  @memberof  Parser
	 */
	static keyRuleCount(expect) {
		return expect.filter((rule) => this.isKeyRule(rule)).length;
	}

	/**
	 *  Split the given string into chunks, separating the key rule chunks into
	 *  their own array items
	 *
	 *  @name      chunk
	 *  @param     {String}  input
	 *  @param     {Map}     rules
	 *  @return    {Array}   chunks
	 *  @memberof  Parser
	 */
	static chunk(input, rules) {
		const expect = [];
		const result = [''];

		for (let i = 0; i < input.length; ++i) {
			const chr = input[i];

			//  skip escaped open/close characters, does not take double+ escapes into consideration
			if (input[i - 1] !== '\\') {
				const open = rules.get(chr);

				if (open) {
					expect.unshift(open);

					if (this.isKeyRule(open) && this.keyRuleCount(expect) === 1) {
						result.push(chr);
						continue;
					}
				}
				else if (expect[0] && chr === expect[0].close) {
					const close = expect.shift();

					if (this.isKeyRule(close) && this.keyRuleCount(expect) === 0) {
						result[result.length - 1] += chr;
						result.push('');
						continue;
					}
				}
			}

			result[result.length - 1] += chr;
		}

		return result.filter((value) => value);
	}

	/**
	 *  Parse the given string into chunks, based on the provided
	 *  (or default) rules and merge adjecent chunks based on an optional
	 *  merge comparison function
	 *
	 *  @param     {String}     input
	 *  @param     {Array|Map}  [rules=null]
	 *  @param     {Function}   [merge=null]
	 *  @return    {Array}      chunks
	 *  @memberof  Parser
	 */
	static parse(input, rules=null, merge=null) {
		const config = rules || this.RULES;

		return this.chunk(input, config instanceof Map ? config : this.rulesMap(config))
			.reduce((carry, chunk, index, all) => {
				const add = [chunk];

				if (index && merge && merge(all[index - 1], chunk)) {
					carry[carry.length - 1] += add.shift();
				}

				return carry.concat(add);
			}, []);
	}
}

module.exports = Parser;
