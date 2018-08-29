"use strict";

var controllers = require('./lib/controllers'),
	SocketPlugins = require.main.require('./src/socket.io/plugins'),
	defaultComposer = module.parent.require('nodebb-plugin-composer-default'),
	plugins = module.parent.exports,
	meta = module.parent.require('./meta'),
	helpers = module.parent.require('./controllers/helpers'),
	utils = module.parent.require('../public/src/utils'),

	async = module.parent.require('async'),
	winston = module.parent.require('winston'),
	nconf = module.parent.require('nconf'),

	sanitize = require('sanitize-html'),

	plugin = {};

var allowedTags = ['span', 'a', 'pre', 'blockquote', 'small', 'em', 'strong',
	'code', 'kbd', 'mark', 'address', 'cite', 'var', 'samp', 'dfn',
	'sup', 'sub', 'b', 'i', 'u', 'del', 'ol', 'ul', 'li', 'dl',
	'dt', 'dd', 'p', 'br', 'video', 'audio', 'source', 'iframe', 'embed',
	'param', 'object', 'img', 'table', 'tbody', 'tfoot', 'thead', 'tr', 'td', 'th',
	'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr'];

var allowedAttributes = {
	'a': ['href', 'hreflang', 'media', 'rel', 'target', 'type'],
	'img': ['alt', 'height', 'ismap', 'src', 'usemap', 'width'],
	'iframe': ['height', 'name', 'src', 'width'],
	'span': [],
	'video': ['autoplay', 'controls', 'height', 'loop', 'muted', 'poster', 'preload', 'src', 'width'],
	'audio': ['autoplay', 'controls', 'loop', 'muted', 'preload', 'src'],
	'embed': ['height', 'src', 'type', 'width'],
	'object': ['data', 'form', 'height', 'name', 'type', 'usemap', 'width'],
	'param': ['name', 'value'],
	'source': ['media', 'src', 'type']};

var globalAttributes = ['accesskey', 'class', 'contenteditable', 'dir',
	'draggable', 'dropzone', 'hidden', 'id', 'lang', 'spellcheck', 'style',
	'tabindex', 'title', 'translate'];

for (var i = 0; i < allowedTags.length; i++) {
	if (!allowedAttributes[allowedTags[i]]) allowedAttributes[allowedTags[i]] = [];

	for (var j = 0; j < globalAttributes.length; j++) allowedAttributes[allowedTags[i]].push(globalAttributes[j]);
}

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
};

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
		data.content = sanitize(data.content, {allowedTags: allowedTags, allowedAttributes: allowedAttributes});
	}else if (data && data.post && data.post.content) {
		data.post.content = sanitize(data.post.content, {allowedTags: allowedTags, allowedAttributes: allowedAttributes});
	}
	callback(null, data);
};

plugin.build = function(data, callback) {
	// No plans for a standalone composer route, so handle redirection on f5
	var req = data.req;
	var res = data.res;

	if (req.query.p) {
		if (!res.locals.isAPI) {
			if (req.query.p.startsWith(nconf.get('relative_path'))) {
				req.query.p = req.query.p.replace(nconf.get('relative_path'), '');
			}

			return helpers.redirect(res, req.query.p);
		} else {
			return res.render('', {});
		}
	} else if (!req.query.pid && !req.query.tid && !req.query.cid) {
		return helpers.redirect(res, '/');
	}

	callback(null, data);
}

plugin.checkContent = function (data, callback) {
	data.content = utils.stripHTMLTags(data.content);
	process.nextTick(callback, null, data);
};

module.exports = plugin;
