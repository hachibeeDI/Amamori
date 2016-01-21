import React from 'react';

import debounce from 'lodash/function/debounce';

export {debounce}


/**
 * @typedef {StoreObservable} StoreObservable
 * @property {function(name:string,...Object)} subscribe block
 */


export default class View extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * @param {Store} store The Store you will observe.
   * @returns {StoreObservable}
   */
  observe(store) {
    return {
      on: (func) => {
        func(store.on.bind(store));
      }
    }
  }
}
