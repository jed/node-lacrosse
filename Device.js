var stream = require("stream")
var util = require("util")
var request = require("request")

function Device(client, id, options) {
  this.client = client
  this.id = id
}

Device.prototype.createReadStream = function() {
  return new DeviceRawReadStream(this).pipe(normalize)
}

util.inherits(DeviceRawReadStream, stream.Readable)

function DeviceRawReadStream(device) {
  stream.Readable.call(this, {objectMode: true})

  this.device = device
}

DeviceRawReadStream.prototype._started = false

DeviceRawReadStream.prototype._read = function() {
  var stream = this
  var client = this.device.client

  if (!client._authenticated) {
    return client.on("login", this._read.bind(this))
  }

  var options = {
    uri: "https://www.lacrossealerts.com/v1/observations/",
    qs: {id: this.device.id},
    jar: this.device.client.jar,
    json: true
  }

  if (!this._started) {
    options.qs.duration = "week"
    this._started = true
    get()
  }

  else setTimeout(get, 1000 * 60 * 5)

  function get() {
    request.get(options, function(err, res, data) {
      if (err) return stream.emit("error", err)

      var data = data.response && data.response.obs

      if (!obs) return process.exit()

      stream.push(data)
    })
  }
}

var normalize = new stream.Transform({objectMode: true})

normalize._transform = function(data, encoding, cb) {
  data.forEach(function(data) {
    this.push({
      timestamp: new Date(data.timeStamp * 1000),
      temperature: data.values.temp2,
      humidity: data.values.rh,
      linkQuality: data.values.linkquality / 100,
      lowBattery: data.values.lowbatt
    })
  }, this)

  cb()
}

module.exports = Device