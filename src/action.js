import axios from 'axios';

import {getAuthToken, isTokenValid} from './util/auth';


// TODO: いちいち引数にコンポーネントを明示的に渡さないといけないのはダサい


/**
 * make a event handlable function which can take any arguments.
 * Example:
 *    handleHoge: EventHandler((ctx, props, state, ev) => { // blabla })
 *
 *    // in render
 *    <input onChange={act.handleHoge(this)} />
 */
export function EventHandler(func) {
  return component => {
    return (...args) => {
      const ctx = component.props.dispatcher || component.context.dispatcher;
      return func.call(
        'do not use "this"',
        ctx,
        component.props,
        component.state,
        ...args
      );
    };
  };
}


/**
 * make a event handlable function which can take any arguments.
 * Example:
 *    setupHoge: Executor((ctx, props, state, url, val) => {
 *
 *    // somewhere like componentWillMount
 *    act.setupHoge(this, '/api/hoge', {hoge: 1})
 */
export function Executor(func) {
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


/**
 * @param {string} [baseURL=/api/] api baseURL
 * @param {string} [tokenField=X-Account-Token] http header field of authorization token
 * @returns {Tuple.<axios,Error>} axios and error
 */
export function authorizedRequest(baseURL = '/api/', tokenField = 'X-Account-Token') {
  const token = getAuthToken();
  const [isValid, err] = isTokenValid(token);
  if (!isValid) {
    return [null, new Error(err)];
  }
  return [axios.create({baseURL: baseURL, headers: {[tokenField]: token}}), null];
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
