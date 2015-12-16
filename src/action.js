
export function EventHandler(func) {
  return (ctx, component) => {
    return (...args) => {
      return func.call('do not use "this"', ctx, component.props, component.state, ...args);
    };
  };
}
