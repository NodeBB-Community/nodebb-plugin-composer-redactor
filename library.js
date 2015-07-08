"use strict";

var SocketPlugins = require.main.require('./src/socket.io/plugins'),
	defaultComposer = require.main.require('nodebb-plugin-composer-default'),

	plugin = {};

plugin.init = function(data, callback) {
	SocketPlugins.composer = defaultComposer.socketMethods;

	callback();
}

module.exports = plugin;