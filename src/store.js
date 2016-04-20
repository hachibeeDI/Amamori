import {EventEmitter} from 'events'


export default class Store extends EventEmitter {
  /**
   * @override
   * I recommend to use Immutable.Record by immutable.js
   */
  static get stateType() {
    return Object
  }

  /**
   * @override
   * I recommend to use Logger by js-logger
   */
  static get logger() {
    return null
  }

  get state() { return this._state }
  set state(s) {this._state = s}

  get label() { return this._label }

  _initializeLogger(logger) {
    if (logger == null) {
      this._logger = {
        debug(...msg) { },
        info(...msg) { },
        warn(...msg) { },
      }
      return
    }
    this._logger = logger
  }


  /**
   * @param {flux.Dispactcher} dispatcher dispatcher
   * @returns {void}
   */
  constructor(dispatcher) {
    super();
    const [_, storePrefix] = this.constructor.name.match(/(.+)Store$/)
    this._label = storePrefix.toLowerCase()
    this._initializeLogger(this.constructor.logger)
    this._logger.info(`${this._label} is initializing`)

    this.dispatcher = dispatcher;
    const d = this.dispatcher;
    d.once(`${this._label}:initialize`, data => {
      this._logger.debug('initialize', data)
      this.state = new this.constructor.stateType(this.initializeState(data))
      this.emit('initialized', this.state)
    })

    this._callbacks = [];
    const subscriber = (type, callback) => {
      d.on(type, callback)
      this._callbacks.push([type, callback])
    }
    this.observeres(subscriber)
    subscriber('error', response => {
      this._logger.warn(response)
      this.emit('onError', response)
    });

    this._state = new (this.constructor.stateType)()  // default state
  }

  /**
   * this method is called once by 'initialize' event
   * overridable
   * @param {T} data state
   * @returns {T}
   */
  initializeState(action) { return action }

  /**
   * @param {function(before:<T>)} updater state mutater
   * @returns {void}
   */
  update(updater) {
    this._logger.info('preUpdate', this.state)

    const before = this.state
    const after = before.withMutations(updater)
    if (before !== after) {
      this._logger.info('updated', after)
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

  dispose() {
    this._callbacks.forEach(([k, f]) => {
      this.dispatcher.removeListener(k, f)
      f = null
    })
    this.removeAllListeners()
    this.dispatcher = null
    this.state = null
  }
}
