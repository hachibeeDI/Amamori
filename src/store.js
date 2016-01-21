import {EventEmitter} from 'events';

import {clearAuthToken} from './util/auth'


/**
 * Example:
 *
 * class SystemToolStore extends Store {
 *   data = '';
 * }
 *
 * class HogeComponent extends React.Component {
 *   constructor(props) {
 *     super(props);
 *     const self = this;
 *     this.store = new HogeStore(HogeDispatcher);
 *     this.store.observe({
 *       toolChanged(targVal) {
 *         if (targVal === this.data) {
 *           self.setState({result: targVal});
 *         }
 *       },
 *       toolExeced(result) {
 *         console.log('aaa');
 *       }
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
    this.dispatcher.on('error', (response) => {
      console.error(response);
      this.emit('onError', response);
    });
    this.dispatcher.on('loginSuspend', (e) => {
      clearAuthToken();
      window.sessionStorage.setItem('lastLocation', window.location.pathname);
      this.emit('loginSuspend');
    });
  }

  publishError(message) {
    this.emit('onError', {data: {message}});
  }

  /**
   * @param {function(subscribe:function(name:string, listener:function(...any)))} func subscriber which is observe the dispatcher events.
   * @returns {Store}
   */
  observe(func) {
    const d = this.dispatcher;
    func(d.on.bind(d));
    return this;
  }
}
