import EventEmitter from 'events';


class _Dispatcher extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
  }
}


export default function CreateDispatcher(name) {
  return new _Dispatcher(name);
};
