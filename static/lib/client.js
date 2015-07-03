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
});