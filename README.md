# Amamori

A Gauche Flux Framework.


## Overview

Component is a class have utility to observe store event that inherits React view.  
Dispatcher is just EventEmitter.  
ActionCreator is just functions.  
Store is just a class inherits EventEmitter.


## Example

Component

```javascript

import React from 'react'
import {render} from 'react-dom'
import {CreateDispatcher, AppContextProvider, Component} from 'amamori'

import {NewTodoStore, TodoStore} from './store'
import ActionCreator from './action'


const Todo = props => {
  return (
    <li>
      <article>
        <h5>Title: {props.title}</h5>
        <p>{props.content}</p>
      </article>
    </li>
  );
}


class TodoView extends Component {
  static get storeTypes() { return [NewTodoStore, TodoStore] }

  componentDidMount() {
    ActionCreator.initialize(this)
  }

  render() {
    console.log(this.state)
    console.log(this.__initializedCount)
    if (!this.isStoresInitialized) return (<section />)

    const {todo, newtodo} = this.state
    console.log(todo, newtodo)
    console.log(todo.get('todo'))
    const todoElements = todo.get('todo').map((t, i) => <Todo key={i} {...t} />)
    const handleEdit = ActionCreator.handleNewTodoChanges(this)
    return (
      <section>
        <form onSubmit={ActionCreator.handleTodoAdd(this)}>
          <input
            type="text"
            name="title"
            value={newtodo.get('title')}
            onChange={handleEdit} />
          <textarea
            name="content"
            cols="30"
            rows="5"
            value={newtodo.get('content')}
            onChange={handleEdit} />
          <button type="submit">add</button>
        </form>
        {todoElements}
      </section>
    )
  }
}


const Dispatcher = CreateDispatcher('todo');
class RootContainer extends AppContextProvider { }

document.addEventListener('DOMContentLoaded', e => {
  render(
    <RootContainer dispatcher={Dispatcher}>
      <TodoView />
    </RootContainer>
    , document.getElementById('amamori'));
});

```


ActionCreator

```javascript

import {EventHandler, Executor} from 'amamori';


const ActionCreator = {
  initialize: Executor((ctx, props, state) => {
    // ajaxのかわり
    Promise
      .resolve({todo: [
        {id: 1, title: 'default', content: 'hogehogehoeg'}
      ]})
      .then(data => ctx.emit('todo:initialize', data))
    ctx.emit('newtodo:initialize', {title: '', content: ''})
  }),

  handleNewTodoChanges: EventHandler((ctx, props, state, ev) => {
    console.log(ctx, state);
    const targ = ev.currentTarget || ev.target
    ctx.emit(`newtodo:${targ.name}:changes`, targ.value)
  }),

  handleTodoAdd: EventHandler((ctx, props, state, ev) => {
    console.log(ctx, state);
    ev.preventDefault()
    ctx.emit('newtodo:submit', state.newtodo)
  }),
}

export default ActionCreator

```

Store

```javascript

import {Store} from 'amamori'
import Immutable from 'immutable'

const TodoRecord = Immutable.Record({title: '', content: ''})


export class NewTodoStore extends Store {
  static get stateType() { return TodoRecord }

  observeres(subscribe) {
    subscribe('newtodo:title:changes', val => {
      this.update(state => state.set('title', val))
    })
    subscribe('newtodo:content:changes', val => {
      this.update(state => state.set('content', val))
    })
    subscribe('newtodo:submit', newtodo => {
      this.update(state => {
        state.set('title', '')
        state.set('content', '')
      })
    })
  }
}


export class TodoStore extends Store {
  static get stateType() { return Immutable.Record({todo: Immutable.List()}) }

  observeres(subscribe) {
    subscribe('newtodo:submit', newtodo => {
      this.update(state => {
        state.todo.push(newtodo.toJS())
      })
    })
  }
}

```
