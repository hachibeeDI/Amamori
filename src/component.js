import React from 'react';


/**
 * @typedef {StoreObservable} StoreObservable
 * @property {function(name:string,...Object)} subscribe block
 */


class ComponentBase extends React.Component {
  /**
   * @param {Store|Array.<Store>} store The Store you will observe.
   * @returns {StoreObservable}
   */
  observe(store) {
    if (store.length) {
      return {
        on: func => {
          store.forEach(s => func(s.on.bind(s)))
        }
      };
    }
    return {
      on: func => {
        func(store.on.bind(store));
      }
    };
  }
}


const AmamoriComponentContextTypes = {dispatcher: React.PropTypes.any}


export class Component extends ComponentBase {
  static propTypes = AmamoriComponentContextTypes;

  static get contextTypes() {
    return AmamoriComponentContextTypes;
  }
}


export class AppContextProvider extends ComponentBase {
  static get childContextTypes() {
    return AmamoriComponentContextTypes;
  }

  getChildContext() {
    return {dispatcher: this.props.dispatcher};
  }

  render() {
    // default implement
    return <div>{this.props.children}</div>
  }
}