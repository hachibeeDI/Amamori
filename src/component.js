import React from 'react';


/**
 * @typedef {StoreObservable} StoreObservable
 * @property {function(name:string,...Object)} subscribe block
 */


class ComponentBase extends React.Component {

  /**
   * @param {Class} Store Store's class object
   * @returns {Store}
   */
  createStore(Store) {
    return new Store(this.props.dispatcher || this.context.dispatcher)
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


const AmamoriComponentContextTypes = {dispatcher: React.PropTypes.any}


export class Component extends ComponentBase {
  static get propTypes() {
    return AmamoriComponentContextTypes
  }

  static get contextTypes() {
    return AmamoriComponentContextTypes;
  }

  static get storeTypes() { return null }

  get isStoresInitialized() {
    return Object.keys(this.store).length === this.__initializedCount
  }

  constructor(props) {
    super(props)
    this.store = {}
    this.__initializedCount = 0
  }

  componentWillMount() {
    // Why we don't initialize stores in constructor because of context would not initialized in constructor.
    if (this.constructor.storeTypes) {
      this.constructor.storeTypes
        .map(Store => {
          // NOTE: Store should have "Store" in its name on postfix
          const store = this.createStore(Store)
          return [store.label, store]
        })
        .map(kv => {
          const [k, v] = kv
          this.observe(v).on(subscribe => {
            subscribe('initialized', state => {
              this.setState((previousState, currentProps) => {
                this.__initializedCount += 1
                return {[k]: state}
              })
            })
            subscribe('changed', state => this.setState({[k]: state}))
          })
          this.store[k] = v
        })
    }
  }

  componentWillUnmount() {
    const store = this.store
    for (let key in this.store) {
       if (store.hasOwnProperty(key)) {
         store[key].dispose()
         store[key] = null
       }
    }
    delete this.store
  }

  render() {
    if (!this.isStoresInitialized) {
      return this.loadingView()
    }
    else {
      return this.view()
    }
  }

  /**
   * @override
   */
  loadingView() {
    // default
    return React.createElement('div')
  }

  /**
   * @override
   */
  view() {
    // default
    return React.createElement('div')
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
    return React.createElement('div', null, this.props.children)
  }
}
