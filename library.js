"use strict";

var controllers = require('./lib/controllers'),
	SocketPlugins = require.main.require('./src/socket.io/plugins'),
	defaultComposer = require.main.require('nodebb-plugin-composer-default'),
	plugins = module.parent.exports,
	meta = module.parent.require('./meta'),

	async = module.parent.require('async'),
	winston = module.parent.require('winston'),

	sanitize = require('sanitize-html'),

	plugin = {};

var tags = ['span', 'a', 'pre', 'blockquote', 'small', 'em', 'strong',
	'code', 'kbd', 'mark', 'address', 'cite', 'var', 'samp', 'dfn',
	'sup', 'sub', 'b', 'i', 'u', 'del', 'ol', 'ul', 'li', 'dl',
	'dt', 'dd', 'p', 'br', 'video', 'audio', 'iframe', 'embed',
	'param', 'object', 'img', 'table', 'tbody', 'tfoot', 'thead',
	'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
var attribs = { 'a': ['*'],
		'img': ['src', 'alt'],
		'span': ['class', 'rel', 'data-verified'],
		'iframe': ['*'],
		'video': ['*'],
		'audio': ['*'],
		'embed': ['*'],
		'object': ['*'],
		'param': ['*'],
		'source': ['*'] };

plugin.init = function(data, callback) {
	var router = data.router,
		hostMiddleware = data.middleware,
		hostControllers = data.controllers;
		
	router.get('/admin/plugins/composer-redactor', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/composer-redactor', controllers.renderAdminPage);

	// Expose the default composer's socket method calls for this composer as well
	plugin.checkCompatibility(function(err, checks) {
		if (checks.composer) {
			SocketPlugins.composer = defaultComposer.socketMethods;
		} else {
			winston.warn('[plugin/composer-redactor] Another composer plugin is active! Please disable all other composers.');
		}
	});

	callback();
}

plugin.checkCompatibility = function(callback) {
	async.parallel({
		active: async.apply(plugins.getActive),
		markdown: async.apply(meta.settings.get, 'markdown')
	}, function(err, data) {
		callback(null, {
			markdown: data.active.indexOf('nodebb-plugin-markdown') === -1 || data.markdown.html === 'on',
			//			^ plugin disabled										^ HTML sanitization disabled
			composer: data.active.filter(function(plugin) {
				return plugin.startsWith('nodebb-plugin-composer-') && plugin !== 'nodebb-plugin-composer-redactor';
			}).length === 0
		})
	});
};

plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/plugins/composer-redactor',
		icon: 'fa-edit',
		name: 'Redactor (Composer)'
	});

	callback(null, header);
};

plugin.sanitize = function(data, callback) {
	data.content = sanitize(data.content, {allowedTags: tags, allowedAttributes: attribs});
	callback(null, data);
}

module.exports = plugin;
