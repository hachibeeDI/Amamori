import {EventEmitter} from 'events';

import {clearAuthToken} from './util/auth'


/**
 * Example:
 *
 * class SystemToolStore extends Store {
 *   data = '';
 * }
 *
 * class HogeComponent extends Viwe {
 *   constructor(props) {
 *     super(props);
 *     const self = this;
 *     const store = new HogeStore(HogeDispatcher);
 *     this
 *       .observe(store)
 *       .on(subscribe => {
 *         subscribe('toolChanged', (targVal) => {
 *           if (targVal === this.data) {
 *             self.setState({result: targVal});
 *           }
 *         });
 *     });
 *     this.state = {
 *       result: 'result viewer'
 *     };
 *   }
 * }
 */
export default class Store extends EventEmitter {
  /**
   * @param {flux.Dispactcher} dispatcher dispatcher
   * @returns {void}
   */
  constructor(dispatcher) {
    super();
    this.dispatcher = dispatcher;
    const d = this.dispatcher;
    d.on('error', (response) => {
      console.error(response);
      this.emit('onError', response);
    });
    d.on('loginSuspend', (e) => {
      clearAuthToken();
      window.sessionStorage.setItem('lastLocation', window.location.pathname);
      this.emit('loginSuspend');
    });
    this.observeres(d.on.bind(d))
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
