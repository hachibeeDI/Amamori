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
import {CreateDispatcher, View} from 'amamori'

import TodoStore from './store'
import ActionCreator from './action'


const Dispatcher = CreateDispatcher('todo');


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


class TodoView extends View {
  constructor(props) {
    super(props)
    this.state = {
      todo: [],
      newtodo: {},
    }
    const store = new TodoStore(Dispatcher)
    this.observe(store)
      .on(subscribe => {
        subscribe('initialized', store => this.apply(store))
        subscribe('newtodo:edit', store => this.setState({newtodo: store.newtodo}))
        subscribe('newtodo:submit', store => this.apply(store))
      })
  }

  apply(store) {
    const {todo, newtodo} = store
    this.setState({todo, newtodo})
  }

  componentDidMount() {
    ActionCreator.initialize(Dispatcher)
  }

  render() {
    const todoElements = this.state.todo.map((t, i) => <Todo key={i} {...t} />)
    const handleEdit = ActionCreator.handleNewTodoChanges(Dispatcher, this)
    return (
      <section>
        <form onSubmit={ActionCreator.handleTodoAdd(Dispatcher, this)}>
          <input
            type="text"
            name="title"
            value={this.state.newtodo.title}
            onChange={handleEdit} />
          <textarea
            name="content"
            cols="30"
            rows="5"
            value={this.state.newtodo.content}
            onChange={handleEdit} />
          <button type="submit">add</button>
        </form>
        {todoElements}
      </section>
    )
  }
}


document.addEventListener('DOMContentLoaded', e => {
  render(<TodoView />, document.getElementById('amamori'));
});

```


ActionCreator

```javascript

import {EventHandler, } from 'amamori';


const ActionCreator = {
  initialize(ctx) {
    // ajaxのかわり
    Promise
      .resolve({todo: [
        {id: 1, title: 'default', content: 'hogehogehoeg'}
      ]})
      .then(data => ctx.emit('initialize', data))
  },

  handleNewTodoChanges: EventHandler((ctx, props, state, ev) => {
    const targ = ev.currentTarget || ev.target
    ctx.emit(`newtodo:${targ.name}:changes`, targ.value)
  }),

  handleTodoAdd: EventHandler((ctx, props, state, ev) => {
    ev.preventDefault()
    ctx.emit('newtodo:submit', state.newtodo)
  }),
}

export default ActionCreator
```

Store

```javascript

import {Store} from 'amamori';
import Immutable from 'immutable'

const TodoRecord = Immutable.Record({title: '', content: ''})


export default class TodoStore extends Store {

  constructor(dispatcher) {
    super(dispatcher)
    this.todo;
    this.newtodo = new TodoRecord({})

    this.observe(subscribe => {
      subscribe('initialize', val => {
        this.todo = Immutable.List(val.todo)
        this.emit('initialized', this)
      })
      subscribe('newtodo:title:changes', val => {
        this.setTodo(val, this.newtodo.get('content'))
        this.emit('newtodo:edit', this)
      })
      subscribe('newtodo:content:changes', val => {
        this.setTodo(this.newtodo.get('title'), val)
        this.emit('newtodo:edit', this)
      })
      subscribe('newtodo:submit', newtodo => {
        this.todo = this.todo.push(newtodo.toJS())
        this.setTodo('', '')
        this.emit('newtodo:submit', this)
      })
    })
  }

  setTodo(title, content) {
    this.newtodo = new TodoRecord({title, content})
  }
}
```
