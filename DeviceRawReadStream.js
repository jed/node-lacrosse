var request = require("request")
var util = require("util")
var DeviceStream = require("./DeviceStream")

function DeviceRawReadStream(device) {
  DeviceStream.call(this, device)
  this._started = false
}

util.inherits(DeviceRawReadStream, DeviceStream)

DeviceRawReadStream.prototype._read = function() {
  var stream = this
  var client = this.device.client
  var that = this;

  if (!client._authenticated) {
     return client.on("login", this._read.bind(this))
  }

  var options = this.httpRequestOptions();

  if (!this._started) {
    options.qs.duration = "week"
    this._started = true
    get()
  }

  else setTimeout(get, 1000 * 60 * 5)

  function get() {
    request.get(options, that.createResponseHandler(stream))
  }
}

module.exports = DeviceRawReadStream
