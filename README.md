# Amamori

Minimal Flux Framework.


## Overview

Component is a class have utility to observe store event that inherits React view.  
Dispatcher is just EventEmitter.  
ActionCreator is just functions.  
Store is just a class inherits EventEmitter.


## API

### Dispatcher and AppContextProvider

Dispatcher provides a context between Component relationship with parent and child, and flux elements. This is just a EventEmitter.

AppContextProvider is Container to pass the Dispatcher to child Components.

```javascript
// example

const Dispatcher = CreateDispatcher('todo')
class RootContainer extends AppContextProvider { }

document.addEventListener('DOMContentLoaded', e => {
  render(
    <RootContainer dispatcher={Dispatcher}>
      <SomeNiceComponent />
    </RootContainer>
    , document.getElementById('amamori-example'))
})

```


### Component

Component extends React.Component.

You can declare the stores as static method names `storeTypes`.  
Every store will attach components state automatically.

You'll basically implement the logic to initialize on `componentDidMount`. If you'd like to use `componentWillMount` don't forget to call super function.

You might want to use `loadingView` and `view` method instead of render. `loadingView` will called when declared stores in initializing.

```javascript
// example

class HogeComponent extends Component {
  static get storeTypes() { return [SomeNiceStore] }

  componentDidMount() {
    ActionCreator.initialize(this)
  }

  loadingView() {
    return (<div>now loading...</div>)
  }

  view() {
    return (<div>{this.state.somenice.greet}</div>)
  }
}

```


### Store

```javascript

const NiceRecord = Immutable.Record({greet: '', name: ''})


export class NewTodoStore extends Store {
  static get stateType() { return NiceRecord }

  observeres(subscribe) {
    subscribe('newtodo:content:changes', (key, value) => {
      this.update(state => state.set(key, value))
    })
  }
}

```


### ActionCreator

// writing


