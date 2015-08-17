"use strict";

var controllers = require('./lib/controllers'),
	SocketPlugins = require.main.require('./src/socket.io/plugins'),
	defaultComposer = require.main.require('nodebb-plugin-composer-default'),
	plugins = module.parent.exports,
	meta = module.parent.require('./meta'),

	async = module.parent.require('async'),
	winston = module.parent.require('winston'),

	sanitize = require('sanitize-html'),
	sanitizecss = require('html-css-sanitizer'),

	plugin = {};

var tags = ['span', 'a', 'pre', 'blockquote', 'small', 'em', 'strong',
	'code', 'kbd', 'mark', 'address', 'cite', 'var', 'samp', 'dfn',
	'sup', 'sub', 'b', 'i', 'u', 'del', 'ol', 'ul', 'li', 'dl',
	'dt', 'dd', 'p', 'br', 'video', 'audio', 'source', 'iframe', 'embed',
	'param', 'object', 'img', 'table', 'tbody', 'tfoot', 'thead',
	'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr'];

var attributes = ['abbr', 'accept', 'accept-charset', 'accesskey', 'action',
	'align', 'alt', 'axis', 'border', 'cellpadding', 'cellspacing', 'char',
	'charoff', 'charset', 'checked', 'cite', 'class', 'clear', 'cols',
	'colspan', 'color', 'compact', 'coords', 'datetime', 'dir', 'disabled',
	'enctype', 'for', 'frame', 'headers', 'height', 'href', 'hreflang',
	'hspace', 'id', 'ismap', 'label', 'lang', 'longdesc', 'maxlength',
	'media', 'method', 'multiple', 'name', 'nohref', 'noshade', 'nowrap',
	'prompt', 'readonly', 'rel', 'rev', 'rows', 'rowspan', 'rules', 'scope',
	'selected', 'shape', 'size', 'span', 'src', 'start', 'summary',
	'tabindex', 'target', 'title', 'type', 'usemap', 'valign', 'value',
	'vspace', 'width', 'style'];

var attribs = {};
for (var i = 0; i < tags.length; i++) attribs[tags[i]] = attributes;

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
	function noop(u) { return u }

	if (data && data.content) {
		data.content = sanitize(data.content, {allowedTags: tags, allowedAttributes: attribs});
		data.content = sanitizecss.smartSanitize(data.content, noop, noop);
	}else if (data && data.post && data.post.content) {
		data.post.content = sanitize(data.post.content, {allowedTags: tags, allowedAttributes: attribs});
		data.post.content = sanitizecss.smartSanitize(data.post.content, noop, noop);
	}
	callback(null, data);
}

module.exports = plugin;
