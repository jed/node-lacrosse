var request = require("request")
var util = require("util")
var DeviceStream = require("./DeviceStream")

function DeviceSingleRawReadStream(device) {
  DeviceStream.call(this, device)

  this._sent = false
}

util.inherits(DeviceSingleRawReadStream, DeviceStream)

DeviceSingleRawReadStream.prototype._read = function() {
  var s = this
  var client = this.device.client

  if (!client._authenticated) {
    return client.on("login", this._read.bind(this))
  }

  var options = this.httpRequestOptions();

  if (!this._sent) {
    request.get(options, this.createResponseHandler(s))
    this._sent = true
  }
}

module.exports = DeviceSingleRawReadStream
