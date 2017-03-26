# GolayCode
Simple 24-12 extended golay code implementation in javascript.

You can check out a live demo at [demo](http://serghov.com/golayCode/)

### Code

There are several classes involed,
1. `Matrix.js` contains a class for a generic matrix.
2. `BinaryMreceiving` is a class for binary matrices derived from Matrix
3. `GolaryCode.js` is a class with static members which handles all golay code related things, like encoding or decoding.

### Encoding

In order to encode a binary array call `GolayCode.encode(array)`.

`Array's` length must be 12.

### Decoding

Decoding works the same way `GolayCode.decode(array)`.

`Array's` length must be 24.

### Logging

`GolayCode` class has its own logging mechanism.
If you want to see logs from decoing/encoding you can add your logging function using `GolayCode.addLogHandler()`

### Example usage

```js
GolayCode.addLogHandler(console.log);
const encodedMessage = GolayCode.encode([0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0]);
// transmit your message however you need
// ...
```

On the recieving end
```js
const decodedMessage = GolayCode.decode(transmittedMessage);
// ...
```

### Status

This is still a work in progress, and is mainly made for educational purposes.
It might contain bugs or unexpected behaviours.

The code is documented fairly well, but if you have any questions please feel free to contact me at sergey.hovakimyan@gmail.com