import {Store} from 'amamori';
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
