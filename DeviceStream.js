var stream = require("stream")
var util = require("util")

function DeviceStream(device) {
  stream.Readable.call(this, {objectMode: true})
  this.device = device
}

util.inherits(DeviceStream, stream.Readable)

DeviceStream.prototype.createResponseHandler = function() {
  var that = this
  return function(err, res, data) {
    if (err) return that.emit("error", err)

    var data = data.response && data.response.obs

    if (!data) {
      return process.exit()
    }
    that.push(data)
  };
}

DeviceStream.prototype.httpRequestOptions = function() {
  var ret = {
    uri: "https://www.lacrossealerts.com/v1/observations/",
    qs: {id: this.device.id},
    jar: this.device.client.jar,
    json: true
  };
  return ret;
}

module.exports = DeviceStream
