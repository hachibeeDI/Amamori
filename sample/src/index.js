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
