var util = require("util")
var events = require("events")
var request = require("request")
var Device = require("./Device")

util.inherits(Client, events.EventEmitter)

function Client(options) {
  var client = this

  events.EventEmitter.call(this)

  this.jar = request.jar()
  this.devices = []

  this.Device = function(id, options){
    Device.call(this, client, id, options)
  }

  util.inherits(this.Device, Device)

  this.login(options.username, options.password)
}

Client.prototype._authenticated = false

Client.prototype.login = function(username, password) {
  var client = this
  var options = {
    uri: "https://www.lacrossealerts.com/login",
    jar: this.jar,
    followAllRedirects: true,
    form: {
      username: username,
      password: password,
      "remember[]": "remember"
    }
  }

  request.post(options, function(err, res, data) {
    if (err) {
      return client.emit("error", err)
    }

    if (res.statusCode != 200) {
      return client.emit("error", new Error("Authentication failed"))
    }

    client.devices.splice(0)

    data.replace(/id=(\d+)/g, function(_, id) {
      client.devices.push(new client.Device(id))
    })

    client._authenticated = true
    return client.emit("login")
  })
}

module.exports = Client