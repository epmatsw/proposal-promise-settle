# Promise.settle

ECMAScript Proposal, specs, and reference implementation for `Promise.settle`.

Spec drafted by [@epmatsw](https://github.com/epmatsw).

This proposal is currently [Stage 0](https://tc39.es/process-document/) of the [TC39 Process](https://tc39.github.io/process-document/).

## Rationale

`Promise.settle` settles a single promise and returns a settlement object: `{ status: 'fulfilled', value }` or `{ status: 'rejected', reason }`.

It's like `Promise.allSettled`, but for a single value.

### The Problem

Currently, if you want to get a settlement object for a single promise, you have to use verbose workarounds:

```javascript
// Using Promise.allSettled (wasteful array allocation)
const [result] = await Promise.allSettled([promise]);

// Manual try/catch (verbose and error-prone)
let result;
try {
  result = { status: "fulfilled", value: await promise };
} catch (e) {
  result = { status: "rejected", reason: e };
}
```

Both approaches are unnecessarily verbose for such a common operation.

### Use Cases

- **Graceful error handling**: Capture errors without throwing, allowing inspection of the error before deciding how to proceed
- **Conditional re-throwing**: Examine an error and decide whether to re-throw, wrap, or handle it
- **Testing assertions**: Assert on the settlement status and value/reason without try/catch boilerplate
- **Error aggregation**: Collect multiple settlement results for later processing or reporting

## Examples

```javascript
// Settling a fulfilled promise
const success = await Promise.settle(Promise.resolve("hello"));
// { status: 'fulfilled', value: 'hello' }

// Settling a rejected promise
const failure = await Promise.settle(Promise.reject(new Error("oops")));
// { status: 'rejected', reason: Error: oops }

// Settling a plain value (non-promise)
const plain = await Promise.settle(42);
// { status: 'fulfilled', value: 42 }
```

### Real-World Example

```javascript
async function fetchUserData(userId) {
  const result = await Promise.settle(api.getUser(userId));

  if (result.status === "rejected") {
    if (result.reason instanceof NotFoundError) {
      return null; // User doesn't exist, return null
    }
    throw result.reason; // Re-throw unexpected errors
  }

  return result.value;
}
```

## Naming

The name "settle" is chosen for consistency with the existing `Promise.allSettled` method and the established specification terminology. In the ECMAScript specification, a promise is said to be "settled" when it is either fulfilled or rejected (i.e., no longer pending). This method "settles" a single value and returns its settlement descriptor.

## Specification

- [Ecmarkup source](https://github.com/epmatsw/proposal-promise-settle/blob/HEAD/spec.emu)
- [HTML version](https://epmatsw.github.io/proposal-promise-settle/)

## Reference Implementation

A simple reference implementation:

```javascript
Promise.settle = function settle(value) {
  return this.resolve(value).then(
    (value) => ({ status: "fulfilled", value }),
    (reason) => ({ status: "rejected", reason }),
  );
};
```

## FAQ

### Why not just use `Promise.allSettled([p])[0]`?

While `Promise.allSettled` can be used to settle a single promise, it has two main drawbacks:

1.  **Overhead**: It requires creating an intermediate array and returns another array, which is inefficient for a single operation.
2.  **Readability**: It's less direct and can obscure the intent of settling just one promise.

`Promise.settle` provides a more direct, readable, and performant API for this common use case.

### Why not use a userland helper function?

While a helper function is a viable workaround, standardizing `Promise.settle` offers several advantages:

- **Consistency**: Provides a standard, universally available way to settle a promise.
- **Discoverability**: Easier for developers to find and use than a custom utility.
- **Engine-level Optimizations**: Native implementations can be more performant than userland code.

### What is the relationship to the `Promise.try` proposal?

`Promise.try` is focused on starting a promise chain from a synchronous function that might throw. `Promise.settle` is focused on the _end_ of a promise's lifecycle—inspecting its outcome. They are complementary proposals that address different parts of promise-based workflows.

## Prior Art

The concept of representing a settled result as a sum type (either success or failure) is well-established in many languages:

- **Rust**: [`Result<T, E>`](https://doc.rust-lang.org/std/result/)
- **Swift**: [`Result<Success, Failure>`](https://developer.apple.com/documentation/swift/result)
- **Kotlin**: [`Result<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-result/)
- **Haskell**: [`Either a b`](https://hackage.haskell.org/package/base-4.16.1.0/docs/Data-Either.html)

`Promise.settle` brings this pattern to the forefront for single promises in JavaScript, aligning with the precedent set by `Promise.allSettled`.

## Champion

This proposal is authored by Will Stamper and is seeking a TC39 champion to advance it through the process.
