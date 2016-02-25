import {EventEmitter} from 'events'

import {clearAuthToken} from './util/auth'


export default class Store extends EventEmitter {
  /**
   * @override
   * I recommend to use Immutable.Record by immutable.js
   */
  static get stateType() {
    return Object
  }

  get state() { return this._state }
  set state(s) {this._state = s}

  /**
   * @param {flux.Dispactcher} dispatcher dispatcher
   * @returns {void}
   */
  constructor(dispatcher) {
    super();
    this.dispatcher = dispatcher;
    const d = this.dispatcher;
    d.on('initialize', data => {
      this.state = new this.constructor.stateType(this.initializeState(data))
      this.emit('initialized', this.state)
    })
    d.on('error', response => {
      this.emit('onError', response);
    });
    d.on('loginSuspend', e => {
      clearAuthToken();
      window.sessionStorage.setItem('lastLocation', window.location.pathname);
      this.emit('loginSuspend');
    });
    this.observeres(d.on.bind(d))

    this._state = new (this.constructor.stateType)()  // default state
  }

  /**
   * this method is called once by 'initialize' event
   * overridable
   * @param {T} data state
   * @returns {void}
   */
  initializeState(action) { return action }

  /**
   * @param {function(before:<T>)} updater state mutater
   * @returns {void}
   */
  update(updater) {
    const before = this.state
    const after = before.withMutations(updater)
    if (before !== after) {
      this.state = after
      return this.emit('changed', this.state)
    }
  }


  publishError(message) {
    this.emit('onError', {data: {message}});
  }

  /**
   * this method is called once in the constructor.
   * should override.
   * @param {function(name:string, listener:function(...any))} subscribe will observe the dispatcher events.
   * @returns {void}
   */
  observeres(subscribe) {
  }

  /**
   * @param {function(subscribe:function(name:string, listener:function(...any)))} func subscriber which is observe the dispatcher events.
   * @returns {Store}
   * @deprecated
   */
  observe(func) {
    const d = this.dispatcher;
    func(d.on.bind(d));
    return this;
  }
}
