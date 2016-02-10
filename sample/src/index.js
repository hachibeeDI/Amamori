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
