$(document).ready(function() {
	$(window).on('action:app.load', function() {
		require(['composer'], function(composer) {
			$(window).on('action:composer.topic.new', function(ev, data) {
				composer.newTopic(data.cid);
			});

			$(window).on('action:composer.post.edit', function(ev, data) {
				composer.editPost(data.pid);
			});

			$(window).on('action:composer.post.new', function(ev, data) {
				composer.newReply(data.tid, data.pid, data.topicName, data.text);
			});

			$(window).on('action:composer.addQuote', function(ev, data) {
				var topicUUID = composer.findByTid(data.tid);
				composer.addQuote(data.tid, data.slug, data.index, data.pid, data.topicName, data.username, data.text, topicUUID);
			});
		});
	});

	$(window).on('action:composer.loaded', function(ev, data) {
		var postContainer = $('#cmp-uuid-' + data.post_uuid),
			textarea = postContainer.find('textarea');

		$(window).trigger('action:redactor.load', $.Redactor);
		$(window).off('action:redactor.load');

		textarea.redactor({
			focus: true
		});
	});

	$(window).on('action:composer.resize', function(ev, data) {
		require(['composer'], function(composer) {
			var activeComposer = $('#cmp-uuid-' + composer.active),
				editor = activeComposer.find('.redactor-editor');

			editor.css('min-height', data.containerHeight);
			editor.css('max-height', data.containerHeight);
		});
	});

	// Button sugar
	$.Redactor.opts.plugins = [];
	$.Redactor.addButton = function (name, awesome, onClick) {
		if (typeof awesome === 'object') {
			$.Redactor.prototype[name] = function() {
				return awesome;
			};
		}else{
			$.Redactor.prototype[name] = function() {
				return {
					init: function() {
						var button = this.button.add(name.toLowerCase().replace(/ /g, '-'), name);
						if (awesome) this.button.setAwesome(name.toLowerCase().replace(/ /g, '-'), awesome);
						this.button.addCallback(button, this[name].onClick);
					},
					onClick: function() {
						onClick(this);
					}
				};
			};
		}
		$.Redactor.opts.plugins.push(name);
	};

	//NodeBB https://github.com/NodeBB/nodebb-plugin-composer-redactor/issues/2
	$.Redactor.opts.imageUpload='/api/post/upload';
	$.Redactor.opts.imageUploadParam='files[]';
	$.Redactor.opts.imageUploadHeaders={'x-csrf-token': require.main.require("csrf").get()};
	$.Redactor.opts.imageUploadKey='url';

});
