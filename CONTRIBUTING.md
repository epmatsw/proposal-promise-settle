# Contributing to Promise.settle

We welcome contributions to this proposal! Please follow these guidelines to ensure a smooth process.

## How to Contribute

1.  **Fork the repository** and create your branch from `main`.
2.  **Make your changes**.
3.  **Ensure the tests pass**.
4.  **Submit a pull request**.

## Building the Spec

The specification is written in [Ecmarkup](https://github.com/tc39/ecmarkup). To build the HTML version of the spec, you'll need `ecmarkup` and `bikeshed`.

```sh
npm install -g ecmarkup bikeshed
ecmarkup spec.emu index.html
```

## Running Tests

To run the tests, you'll need [Node.js](https://nodejs.org/) installed.

First, install the development dependencies:

```sh
npm install
```

Then, run the tests:

```sh
npm test
```

## Code of Conduct

This project and everyone participating in it is governed by the [TC39 Code of Conduct](https://tc39.es/code-of-conduct/). By participating, you are expected to uphold this code. Please report unacceptable behavior to the TC39 committee.
