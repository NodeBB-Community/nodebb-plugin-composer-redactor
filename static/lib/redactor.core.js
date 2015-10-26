'use strict';

/* globals define, socket, app, config, ajaxify, utils, templates, bootbox */

define('redactor', [
	'composer',
	'translator'
], function (composer, translator) {

	$(window).on('action:composer.loaded', function (ev, data) {
		var postContainer = $('#cmp-uuid-' + data.post_uuid),
			textarea = postContainer.find('textarea');

		$(window).trigger('action:redactor.load', $.Redactor);
		$(window).off('action:redactor.load');

		textarea.redactor({
			focus  : true,
			plugins: ['video', 'table', 'emoticons']

		});
	});

	$(window).on('action:composer.resize', function (ev, data) {
		var activeComposer = $('#cmp-uuid-' + composer.active),
			editor = activeComposer.find('.redactor-editor');

		editor.css('min-height', data.containerHeight);
		editor.css('max-height', data.containerHeight);
	});

	// Button sugar
	$.Redactor.opts.plugins = [];
	$.Redactor.addButton = function (name, awesome, onClick) {
		if (typeof awesome === 'object') {
			$.Redactor.prototype[name] = function () {
				return awesome;
			};
		}
		else {
			$.Redactor.prototype[name] = function () {
				return {
					init   : function () {
						var button = this.button.add(name.toLowerCase().replace(/ /g, '-'), name);
						if (awesome) {
							this.button.setAwesome(name.toLowerCase().replace(/ /g, '-'), awesome);
						}
						this.button.addCallback(button, this[name].onClick);
					},
					onClick: function () {
						onClick(this);
					}
				};
			};
		}
		$.Redactor.opts.plugins.push(name);
	};

	//NodeBB https://github.com/NodeBB/nodebb-plugin-composer-redactor/issues/2
	require(["csrf"], function (csrf) {
		$.Redactor.opts.imageUploadHeaders = {'x-csrf-token': csrf.get()};
	});
	$.Redactor.opts.imageUpload = '/api/post/upload';
	$.Redactor.opts.imageUploadParam = 'files[]';
	$.Redactor.opts.imageUploadKey = 'url';

	require(['translator'], function (translator) {
		translator.getTranslations(config.userLang, 'redactor', function (langData) {
			console.log(langData);
			$.Redactor.opts.langs[config.userLang] = langData;
			if (langData.html != undefined) {
				$.Redactor.opts.lang = config.userLang;
			}
		});
	});

	var redactor = {};
	redactor.addQuote = function (tid, topicSlug, postIndex, pid, title, username, text) {

		var uuid = composer.findByTid(tid) || composer.active;

		if (text) {
			text = "<blockquote>" + text + "</blockquote>";
		}

		if (uuid === undefined) {
			composer.newReply(tid, pid, title, '[[modules:composer.user_said, ' + username + ']]\n' + text);
			return;
		}
		else if (uuid !== composer.active) {
			// If the composer is not currently active, activate it
			composer.load(uuid);
		}

		var postContainer = $('#cmp-uuid-' + uuid);
		var bodyEl = postContainer.find('textarea');
		var prevText = bodyEl.val();
		if (parseInt(tid, 10) !== parseInt(composer.posts[uuid].tid, 10)) {
			var link = '[' + title + '](/topic/' + topicSlug + '/' + (parseInt(postIndex, 10) + 1) + ')';
			translator.translate('[[modules:composer.user_said_in, ' + username + ', ' + link + ']]\n', config.defaultLang, onTranslated);
		}
		else {
			translator.translate('[[modules:composer.user_said, ' + username + ']]\n', config.defaultLang, onTranslated);
		}

		function onTranslated(translated) {
			composer.posts[uuid].body = (prevText.length ? prevText + '\n\n' : '') + translated + text;
			bodyEl.val(composer.posts[uuid].body);
			focusElements(bodyEl);
		}
	};
	return redactor;
});