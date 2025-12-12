(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module"], factory);
  } else if (typeof exports === "object" && typeof module !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {},
    };
    factory(mod);
    global.promiseSettle = mod.exports;
  }
})(this, function (module) {
  "use strict";

  function settle(value) {
    var P = this;
    return P.resolve(value).then(
      function (v) {
        return { status: "fulfilled", value: v };
      },
      function (r) {
        return { status: "rejected", reason: r };
      },
    );
  }

  if (typeof Promise.settle !== "function") {
    Promise.settle = settle;
  }

  if (module.exports) {
    module.exports = settle;
  }
});
