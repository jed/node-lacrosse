node-lacrosse
=============

A node.js streaming API for [Lacrosse Alert](http://www.lacrossetechnology.com/alerts/) sensors.

Usage
-----

```javascript
var lacrosse = require("./")

var client = new lacrosse.Client({
  username: "MY USERNAME",
  password: "MY PASSWORD"
})

client.on("login", function() {
  console.log("you have %s devices.", client.devices.length)
})

var device = new client.Device("MY DEVICE ID")
var stream = device.createReadStream()

stream.on("data", console.log)
```