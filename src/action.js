
// TODO: いちいち引数にコンポーネントを明示的に渡さないといけないのはダサい


/**
 * make a event handlable function which can take any arguments.
 * Example:
 *    handleHoge: EventHandler((ctx, props, state, ev) => { // blabla })
 *
 *    // in render
 *    <input onChange={act.handleHoge(this)} />
 */
export function EventHandler(...handlers) {
  let [middlewares, func] = handlers
  if (func) {
    return component => {
      return (...args) => {
        const ctx = component.props.dispatcher || component.context.dispatcher;
        const filterdArgs = middlewares.reduce((result, middle) => {return middle(...result)}, args);
        return func.call(
          'do not use "this"',
          ctx,
          component.props,
          component.state,
          ...filterdArgs
        )
      }
    }
  }
  else {
    func = middlewares
    return component => {
      return (...args) => {
        const ctx = component.props.dispatcher || component.context.dispatcher;
        return func.call(
          'do not use "this"',
          ctx,
          component.props,
          component.state,
          ...args
        )
      }
    }
  }
}


/**
 * make a event handlable function which can take any arguments.
 * Example:
 *    setupHoge: Executor((ctx, props, state, url, val) => {
 *
 *    // somewhere like componentWillMount
 *    act.setupHoge(this, '/api/hoge', {hoge: 1})
 *
 * doctest:
 *  > var dammy = {props : {}, state: {}, context: {}}
 *  > var Executor= require('./lib/action.js').Executor
 *  > var hoge = Executor(function(ctx, props, state, x, y) {console.log(x,y)});
 *  > hoge(dammy, 1, 2)
 *  1 2
 *  > var zoge = Executor([
 *        function(foo, bar) { return [foo + bar, 'huga']},
 *        function(a, b) { return [a + 10, b + '-hoge'] }
 *      ],
 *      function(ctx, props, state, x, y) {console.log(x,y)});
 *  > zoge(dammy, 1, 2)
 *  13 'huga-hoge'
 *
 */
export function Executor(...handlers) {
  let [middlewares, func] = handlers
  if (func) {
    return (component, ...args) => {
      const ctx = component.props.dispatcher || component.context.dispatcher;
      const filterdArgs = middlewares.reduce((result, middle) => {return middle(...result)}, args);
      return func.call(
        'do not use "this"',
        ctx,
        component.props,
        component.state,
        ...filterdArgs
      )
    }
  }
  else {
    func = middlewares
    return (component, ...args) => {
      const ctx = component.props.dispatcher || component.context.dispatcher;
      return func.call(
        'do not use "this"',
        ctx,
        component.props,
        component.state,
        ...args
      )
    }
  }
}


export class Action {
  _setActionData(data) {
    this._data = data;
    return this;
  }
  get data() {
    return this._data;
  }

  static fromData(data) {
    const me = new this();
    me._setActionData(me._fromData(data));
    return me;
  }
  /**
   * format action data is passed by component.
   * @returns {object}
   */
  _fromData(data) {
    throw new Error('fromData is not implemented');
  }


  static fromRequest(data) {
    const me = new this();
    me._setActionData(me._fromRequest(data));
    return me;
  }
  /**
   * format action data is passed by ajax request.
   * @returns {object}
   */
  _fromRequest(data) {
    throw new Error('fromRequest is not implemented');
  }

  /**
   * format action data to store
   * @returns {object}
   */
  toData() {
    return this.data;
  }

  /**
   * format action data is passed by component.
   * @returns {object}
   */
  toRequest() {
    return this.data;
  }
}
