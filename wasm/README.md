# WebAssembly module for plan_transfers

This is a module to provide a Javascript interface to the `plan_transfers` method from C++.
This is done as a [WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly) module.

## Steps

1. Install the [emscripten](https://emscripten.org/docs/getting_started/downloads.html) environment.
2. Compile the WASM module with `make all`

The second step requires `em++` which is shipped with emscripten and should thus have been installed in the first step.

The outputs include:
* `plan_transfers.wasm` = the compiled web assembly module (binary file)
* `plan_transfers.js` = a file that wraps the complexity of loading the wasm file, together with some wrapper methods

## How do I use it in Javascript / Node.js?

```js
const xfer = require('./plan_transfers.js');

const list = xfer.plan_transfers(
    ['f0', 'f1', 'b1', 'b0'], // the needles of the source bed configuration (cycle must be CCW)
    ['f1', 'b1', 'b0', 'f0'], // the needles of the target bed configuration (cycle must be CCW)
    2, // either a uniform minimum slack, or the array of slack numbers
    2, // the maximum racking
    false // whether to output transfer needles as strings (false => e.g. 'f1') or arrays (true => e.g. ['f', 1])
);
console.log(list); // the list of transfers
/*
 Output:
[
  [ 'f0', 'bs1' ],   [ 'f1', 'b2' ],
  [ 'bs1', 'f0' ],   [ 'b0', 'fs-1' ],
  [ 'b1', 'fs0' ],   [ 'b2', 'fs1' ],
  [ 'fs0', 'b0' ],   [ 'fs1', 'b1' ],
  [ 'fs-1', 'b-2' ], [ 'b1', 'fs1' ],
  [ 'b0', 'fs0' ],   [ 'b-2', 'f-1' ],
  [ 'fs0', 'b0' ],   [ 'fs1', 'b1' ],
  [ 'f-1', 'bs-1' ], [ 'f0', 'bs0' ],
  [ 'bs-1', 'f0' ],  [ 'bs0', 'f1' ]
]
*/
``` 

## Arguments to `plan_transfers`

* `from` (**required** `[n1, n2, ... nn]`) is an array of knitout needle strings in CCW orientation (as a cycle)
* `to` (**required** `[m1, m2, ... mn]`) is a similar array (must have the same size)
* `slack` (*optional*) either a minimum slack number, or an array of slack numbers for each needle
* `maxRacking` (*optional*) the maximum allowed racking
