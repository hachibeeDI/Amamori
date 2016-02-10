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
