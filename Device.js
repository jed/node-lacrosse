var stream = require("stream")
var DeviceRawReadStream = require("./DeviceRawReadStream")
var DeviceSingleRawReadStream = require("./DeviceSingleRawReadStream")

function Device(client, id, options) {
  this.client = client
  this.id = id
}

Device.prototype.createNormalizer = function() {
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
  return normalize;
}

Device.prototype.createReadStream = function() {
  return new DeviceRawReadStream(this).pipe(this.createNormalizer())
}

Device.prototype.createSingleReadStream = function() {
  return new DeviceSingleRawReadStream(this).pipe(this.createNormalizer())
}

module.exports = Device

