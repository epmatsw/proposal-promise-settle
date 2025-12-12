const assert = require("node:assert");
const test = require("node:test");
require("../polyfill");

test("Promise.settle", async (t) => {
  await t.test("should be a function", () => {
    assert.strictEqual(typeof Promise.settle, "function");
  });

  await t.test("should have a length of 1", () => {
    assert.strictEqual(Promise.settle.length, 1);
  });

  await t.test("should settle a fulfilled promise", async () => {
    const promise = Promise.resolve(42);
    const result = await Promise.settle(promise);
    assert.deepStrictEqual(result, { status: "fulfilled", value: 42 });
  });

  await t.test("should settle a rejected promise", async () => {
    const error = new Error("oops");
    const promise = Promise.reject(error);
    const result = await Promise.settle(promise);
    assert.deepStrictEqual(result, { status: "rejected", reason: error });
  });

  await t.test("should settle a plain value", async () => {
    const result = await Promise.settle(42);
    assert.deepStrictEqual(result, { status: "fulfilled", value: 42 });
  });

  await t.test("should handle a thenable that fulfills", async () => {
    const thenable = {
      then: (resolve) => {
        resolve(42);
      },
    };
    const result = await Promise.settle(thenable);
    assert.deepStrictEqual(result, { status: "fulfilled", value: 42 });
  });

  await t.test("should handle a thenable that rejects", async () => {
    const error = new Error("oops");
    const thenable = {
      then: (resolve, reject) => {
        reject(error);
      },
    };
    const result = await Promise.settle(thenable);
    assert.deepStrictEqual(result, { status: "rejected", reason: error });
  });

  await t.test("should work with promise subclasses", async () => {
    class MyPromise extends Promise {}
    const promise = MyPromise.resolve(42);
    const result = await MyPromise.settle(promise);
    assert.deepStrictEqual(result, { status: "fulfilled", value: 42 });
  });

  await t.test("should return a promise that never rejects", async () => {
    const error = new Error("oops");
    const promise = Promise.reject(error);
    await assert.doesNotReject(Promise.settle(promise));
  });
});
