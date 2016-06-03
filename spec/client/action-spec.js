const assert = require("chai").assert;

describe("action", () => {
  const Action = require("../../lib/action.js");
  var ComponentDammy = {props : {}, state: {}, context: {}};

  describe("Executor", () => {
    it("with no filter", () => {
      var hoge = Action.Executor(function(ctx, props, state, x, y) {
        assert.equal(x, 1);
        assert.equal(y, 2);
      });
      hoge(ComponentDammy, 1, 2);
    });

    it("with filters", () => {
      var hoge = Action.Executor([
        (x, y) => {
          assert.equal(x, 1);
          assert.equal(y, 2);
          return ['foo', 'bar']
        },
        (a, b) => {
          assert.equal(a, 'foo');
          assert.equal(b, 'bar');
          return [10, 20, 30]
        },
      ], function(ctx, props, state, x, y, z) {
          assert.equal(x, 10);
          assert.equal(y, 20);
          assert.equal(z, 30);
      });
      hoge(ComponentDammy, 1, 2);
    });

  });
});
