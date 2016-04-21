'use strict';

const assert = require('chai').assert;
const Immutable = require('immutable')


describe('store', () => {
  const Store = require('../../lib/store.js').default;
  const CreateDispatcher = require('../../lib/dispatcher.js').default;
  const Dispatcher = CreateDispatcher();

  describe('Store', () => {
    it('should call initializeState when initialized', done => {
      class TestStore extends Store {
        static get stateType() {
          return Immutable.Record({a: 'a'})
        }
        initializeState(action) {
          done()
        }
      }

      new TestStore(Dispatcher);
      Dispatcher.emit('test:initialize', {});
    });

    it('should emit initialized-event to component when initialized', done => {
      class TestStore extends Store {
        static get stateType() {
          return Immutable.Record({a: 'a'})
        }
      }

      const testStore = new TestStore(Dispatcher);
      testStore.once('initialized', state => {
        assert.equal(state.a, 'abc');
        done();
      });
      Dispatcher.emit('test:initialize', {a: 'abc'});
    });

    it('should emit changed-event to component when it was updated', done => {
      class TestStore extends Store {
        static get stateType() {
          return Immutable.Record({a: 'a'})
        }
        observeres(subscribe) {
          subscribe('test:change', (key, val) => {
            this.update(state => state.set(key, val));
          });
        }
      }

      const testStore = new TestStore(Dispatcher);
      testStore.on('changed', state => {
        assert.equal(state.a, 'hahaha');
        done();
      });
      Dispatcher.emit('test:initialize', {a: 'abc'});
      Dispatcher.emit('test:change', 'a', 'hahaha');
    });

  });
});

