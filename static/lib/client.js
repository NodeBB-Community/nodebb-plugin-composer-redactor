$(document).ready(function() {
	$(window).on('action:connected', function() {
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
});