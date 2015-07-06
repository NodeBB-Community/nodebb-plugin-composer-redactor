"use strict";

var async = require.main.require('async'),

	meta = require.main.require('./src/meta'),
	privileges = require.main.require('./src/privileges'),
	posts = require.main.require('./src/posts'),
	topics = require.main.require('./src/topics'),
	plugins = require.main.require('./src/plugins'),
	
	server = require.main.require('./src/socket.io'),
	Sockets = {};

Sockets.push = function(socket, pid, callback) {
	privileges.posts.can('read', pid, socket.uid, function(err, canRead) {
		if (err || !canRead) {
			return callback(err || new Error('[[error:no-privileges]]'));
		}
		posts.getPostFields(pid, ['content', 'tid', 'uid', 'handle'], function(err, postData) {
			if(err || (!postData && !postData.content)) {
				return callback(err || new Error('[[error:invalid-pid]]'));
			}

			async.parallel({
				topic: function(next) {
					topics.getTopicDataByPid(pid, next);
				},
				tags: function(next) {
					topics.getTopicTags(postData.tid, next);
				},
				isMain: function(next) {
					posts.isMain(pid, next);
				}
			}, function(err, results) {
				if(err) {
					return callback(err);
				}

				if (!results.topic) {
					return callback(new Error('[[error:no-topic]]'));
				}

				callback(null, {
					pid: pid,
					uid: postData.uid,
					handle: parseInt(meta.config.allowGuestHandles, 10) ? postData.handle : undefined,
					body: postData.content,
					title: results.topic.title,
					topic_thumb: results.topic.thumb,
					tags: results.tags,
					isMain: results.isMain
				});
			});
		});
	});
};

Sockets.editCheck = function(socket, pid, callback) {
	posts.isMain(pid, function(err, isMain) {
		callback(err, {
			titleEditable: isMain
		});
	});
};

Sockets.renderPreview = function(socket, content, callback) {
	plugins.fireHook('filter:parse.raw', content, callback);
};

Sockets.renderHelp = function(socket, data, callback) {
	var helpText = meta.config['composer:customHelpText'] || '';

	if (meta.config['composer:showHelpTab'] === '0') {
		return callback(new Error('help-hidden'));
	}

	plugins.fireHook('filter:parse.raw', helpText, function(err, helpText) {
		if (!meta.config['composer:allowPluginHelp'] || meta.config['composer:allowPluginHelp'] === '1') {
			plugins.fireHook('filter:composer.help', helpText, callback);
		} else {
			callback(null, helpText);
		}
	});
};

Sockets.notifyTyping = function(socket, data) {
	if (!socket.uid || !parseInt(data.tid, 10)) {
		return;
	}
	server.in('topic_' + data.tid).emit('event:topic.notifyTyping', data);
};

Sockets.stopNotifyTyping = function(socket, data) {
	if (!socket.uid || !parseInt(data.tid, 10)) {
		return;
	}
	server.in('topic_' + data.tid).emit('event:topic.stopNotifyTyping', data);
};

Sockets.getFormattingOptions = function(socket, data, callback) {
	plugins.fireHook('filter:composer.formatting', {
		options: [
			{ name: 'tags', className: 'fa fa-tags', mobile: true }
		]
	}, function(err, payload) {
		callback(err, payload.options);
	});
};

module.exports = Sockets;