const Patternize = require('./patternize');
const storage = new WeakMap();

/**
 *  Register and trigger pattern based handlers
 *
 *  @class Emitter
 */
class Emitter {
	/**
	 *  Creates an instance of Emitter
	 *
	 *  @param     {Patternize}  patternize
	 *  @memberof  Emitter
	 */
	constructor(patternize=null) {
		const instance = patternize || new Patternize();

		if (!(instance instanceof Patternize)) {
			throw new Error(`Expected Patternize instance, got ${JSON.stringify(instance)}`)
		}

		storage.set(this, instance);
	}

	/**
	 *  Register a handler for a specific pattern
	 *
	 *  @name      on
	 *  @param     {String}    input
	 *  @param     {Function}  handle
	 *  @param     {Number}   [limit=Infinity]
	 *  @return    void
	 *  @memberof  Emitter
	 */
	on(input, handle, limit=Infinity) {
		const patternize = storage.get(this);
		const pattern = patternize.register(input);

		if (!storage.has(pattern)) {
			storage.set(pattern, []);
		}

		storage.get(pattern).push({ handle, limit, emitted: 0 });
	}

	/**
	 *  Register a handler for a specific pattern, which is triggered only once
	 *
	 *  @name      once
	 *  @param     {String}    input
	 *  @param     {Function}  handle
	 *  @param     {Number}   [limit=Infinity]
	 *  @return    void
	 *  @memberof  Emitter
	 */
	once(input, handle) {
		this.on(input, handle, 1);
	}

	/**
	 *  Remove a pattern/handle combination
	 *
	 *  @name      off
	 *  @param     {String}    input
	 *  @param     {Function}  handle
	 *  @returns   {Array}     removed handles
	 *  @memberof  Emitter
	 */
	off(input, handle) {
		const patternize = storage.get(this);

		return patternize.find(input)
			.filter((pattern) => storage.has(pattern))
			.reduce((carry, pattern) => {
				const itemList = storage.get(pattern);
				const removed = itemList
					.reduce((drop, item, index) => [].concat(item.handle === handle ? index : []).concat(drop), [])
					.reduce((drop, index) => drop.concat(itemList.splice(index, 1)), []);

				if (!itemList.length) {
					storage.delete(pattern);
				}

				return carry.concat(removed.map((item) => item.handle));
			}, []);
	}

	/**
	 *  Emit a string, triggering the registered handlers for all
	 *  matching patterns
	 *
	 *  @name      emit
	 *  @param     {String}  input
	 *  @param     {...any}  args
	 *  @return    void
	 *  @memberof  Emitter
	 */
	emit(input, ...args) {
		const patternize = storage.get(this);

		patternize.match(input)
			.filter((pattern) => storage.has(pattern))
			.forEach((pattern) => {
				const subject = {
					input,
					values: pattern.getMatchedValues(input),
				};
				const itemList = storage.get(pattern);

				itemList
					.reduce((drop, item, index) => {
						setImmediate(item.handle, ...[subject].concat(args));

						if (++item.emitted >= item.limit) {
							drop.push(index);
						}

						return drop;
					}, [])
					.forEach((index) => itemList.splice(index, 1));
			});
	}
}

module.exports = Emitter;
