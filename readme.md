# err-hndlr

> Error handler for either throwing locally or sending a bug ticket to a rest api

[![Travis Build Status](https://img.shields.io/travis/jneidel/err-hndlr.svg?style=flat-square)](https://travis-ci.org/jneidel/err-hndlr)
[![License MIT](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](https://github.com/jneidel/err-hndlr/blob/master/license)
[![Npm Downloads](https://img.shields.io/npm/dw/err-hndlr.svg?style=flat-square)](https://www.npmjs.com/package/err-hndlr)

## Install

[![Npm Version](https://img.shields.io/npm/v/err-hndlr.svg?style=flat-square)](https://www.npmjs.com/package/err-hndlr)

```
$ npm install err-hndlr
```

## Usage

```js
const errHndlr = require( "err-hndlr" );

errHndlr.init(
  process.argv[2] === "--debug",
  "https://api.jneidel.com/errors/submit",
  {
    applicationId: "1337"
  }
)

errHndlr.throw(
  "smt went wrong",
  {
    env: {...},
  },
  false
)

// If --debug flag was passed:
//=> Error: something went wrong

// If --debug flag was not passed:
// POST https://api.jneidel.com/error/submit
//    {
//      applicationId: "1337",
//      error: {
//        msg: "smt went wrong",
//        stack: "...",
//      },
//      env: {...},
//    }
```


## API

### init( isThrow, apiAddress, data, options )

Globally initializes the error handler. This function has to be run before throwing any errors.

```js
errHndlr.init(
  false,
  http://api.jneidel.com/errors/submit,
  { id: "1337" },
)
```

**isThrow:**

<table><tr>
  <td>Default: <code>true</code></td>
  <td>Type: <code>boolean</code></td>
</tr></table>

Whenever errors should be thrown locally (`true`) or be sent to the rest api (`false`).

**apiAddress:**

<table><tr>
  <td>Type: <code>string</code></td>
</tr></table>

Rest api endpoint where error requests should be sent if `isThrow=false`. The data will be sent in the body of the POST request.

**data:**

<table><tr>
  <td>Default: <code>{}</code></td>
  <td>Type: <code>object</code></td>
</tr></table>

The data that will be sent along on every request. You might want to include device specific data (os, etc.) and application data (name, version, etc.) here.

**options:**

<table><tr>
  <td>Default: <code>{}</code></td>
  <td>Type: <code>object</code></td>
</tr></table>

Currently supported options are:

**app:**

Require your package.json through the app option to include the app's name and version in every request.

```js
// options:
{
  app: require( "../package.json" )
}
// POST request:
{
  ...
  app: {
    name: "err-hndlr",
    version: "0.0.1",
  }
}
```

**os:**

Pass a truthy value to include the `os.type()` and `os.platform()` in every request.

```js
// options:
{
  os: true
}
// POST request:
{
  ...
  os: {
    type: "Linux",
    platform: "linux",
  }
}
```

### throw( msg, data, isExit )

```js
errHndlr.throw(
  "something went wrong",
  data: {
    env: {...}
  },
  false,
).catch( err => {...} ) // To handle connection errors (ECONNREFUSED)
```

**msg:**

<table><tr>
  <td>Type: <code>string</code></td>
</tr></table>

The message used to call `new Error( msg )`.

**data:**

<table><tr>
  <td>Default: <code>{}</code></td>
  <td>Type: <code>object</code></td>
</tr></table>

Data to be include on this specific request. Might include environmental variables, state, etc.

**isExit:**

<table><tr>
  <td>Default: <code>false<code></td>
  <td>Type: <code>boolean</code></td>
</tr></table>

Whenever the process should exit if the error is thrown.

## Related

- [`jneidel/api.jneidel.com`](https://github.com/jneidel/api.jneidel.com) - The api this module was built for. See for a usage example.

## License

MIT © [Jonathan Neidel](https://jneidel.com)

