[![Build Status](https://travis-ci.org/hachibeeDI/Amamori.svg?branch=master)](https://travis-ci.org/hachibeeDI/Amamori)

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

ActionCreator is receive Dispatcher and cause Action, so That could be just plain function.  
There is some helper for communicate with Component in Amamori.

EventHandler, Executor will help you kick action and watch component event. Those will have middrewares.


```javascript

import {EventHandler, Executor} from 'amamori';


// middleware sample
const extractTarget = function (ev) {
  return [ev.currentTarget || ev.target];
}


const preventBubling = function (ev) {
  ev.preventDefault()
  return [ev];
}


const ActionCreator = {
  initialize: Executor((ctx, props, state) => {
    // or some api call
    Promise
      .resolve({todo: [
        {id: 1, title: 'default', content: 'hogehogehoeg'}
      ]})
      // ${lowered model name}:initialize will cause model initialization
      .then(data => ctx.emit('todo:initialize', data))
    ctx.emit('newtodo:initialize', {title: '', content: ''})
  }),

  handleNewTodoChanges: EventHandler([extractTarget], (ctx, props, state, targ) => {
    ctx.emit(`newtodo:${targ.name}:changes`, targ.value)
  }),

  handleTodoAdd: EventHandler([preventBubling, extractTarget], (ctx, props, state, targ) => {
    console.log(targ);  // we can use multiple middreware
    ctx.emit('newtodo:submit', state.newtodo)
  }),
}

export default ActionCreator

```


## Dependency

- React

- Immutable.js


### Recomend

- react-router

- axios
