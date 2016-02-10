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
