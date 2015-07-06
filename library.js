"use strict";

var SocketPlugins = require.main.require('./src/socket.io/plugins'),
	socketMethods = require('./websockets'),

	plugin = {};

plugin.init = function(data, callback) {
	SocketPlugins.defaultComposer = socketMethods;

	callback();
}

module.exports = plugin;