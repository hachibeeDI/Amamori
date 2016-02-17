import React from 'react';


/**
 * @typedef {StoreObservable} StoreObservable
 * @property {function(name:string,...Object)} subscribe block
 */


class ViewBase extends React.Component {
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


const AmamoriViewContextTypes = {dispatcher: React.PropTypes.any}


export class View extends ViewBase {
  static get contextTypes() {
    return AmamoriViewContextTypes;
  }
}


export class RootView extends ViewBase {
  static get childContextTypes() {
    return AmamoriViewContextTypes;
  }

  getChildContext() {
    return {dispatcher: this.props.dispatcher};
  }
}
