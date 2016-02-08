import React from 'react';


/**
 * @typedef {StoreObservable} StoreObservable
 * @property {function(name:string,...Object)} subscribe block
 */


export class View extends React.Component {
  constructor(props) {
    super(props);
  }

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
