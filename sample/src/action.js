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
