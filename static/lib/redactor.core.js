'use strict';

/* globals define, socket, app, config, ajaxify, utils, templates, bootbox */

define('redactor', [
    'composer',
    'translator',
    'composer/autocomplete',
    'composer/resize',
    'scrollStop'
], function (composer, translator, autocomplete, resize, scrollStop) {
    function redactorify(textarea, data) {
        var textDirection = $('html').attr('data-dir');

        $(window).trigger('action:redactor.load', $.Redactor);
        $(window).off('action:redactor.load');

        var options = {
            direction: textDirection || undefined,
            imageUploadFields: {
                '_csrf': config.csrf_token
            },
            fileUploadFields: {
                '_csrf': config.csrf_token
            },
        };

        if (data.height) {
            options.maxHeight = parseInt(data.height, 10) || undefined;
        }

        if (data.onChange && typeof data.onChange === 'function') {
            options.callbacks = options.callbacks || {};
            options.callbacks.change = data.onChange;
        }

        textarea.redactor(options);
    };

    $(window).on('action:composer.loaded', function (ev, data) {
        var postContainer = $('.composer[data-uuid="' + data.post_uuid + '"]')
        var textarea = postContainer.find('textarea');

        redactorify(textarea, data);

        var cidEl = postContainer.find('.category-list');
        if (cidEl.length) {
          cidEl.attr('id', 'cmp-cid-' + data.post_uuid);
        } else {
          postContainer.append('<input id="cmp-cid-' + data.post_uuid + '" type="hidden" value="' + ajaxify.data.cid + '"/>');
        }

        if (config.allowTopicsThumbnail && data.composerData.isMain) {
          var thumbToggleBtnEl = postContainer.find('.re-topic_thumb');
          var url = data.composerData.topic_thumb || '';

          postContainer.find('input#topic-thumb-url').val(url);
          postContainer.find('img.topic-thumb-preview').attr('src', url);

          if (url) {
            postContainer.find('.topic-thumb-clear-btn').removeClass('hide');
          }
          thumbToggleBtnEl.addClass('show');
          thumbToggleBtnEl.off('click').on('click', function() {
            var container = postContainer.find('.topic-thumb-container');
            container.toggleClass('hide', !container.hasClass('hide'));
          });
        }

        var editor = postContainer.find('.redactor-layer');
        editor.addClass('write');

        scrollStop.apply(editor);
        autocomplete.init(postContainer, data.post_uuid);
        resize.reposition(postContainer);
    });

    $(window).on('action:composer.submit', function (e, data) {
        // Remove all empty paragraph blocks from composer content
        data.composerData.content = data.composerData.content.replace(/<p>(<br>| )+<\/p>/gm, '');
    });

    $(window).on('action:chat.loaded', function (e, containerEl) {
        var composerEl = $(containerEl).find('[component="chat/composer"]');
        var inputEl = composerEl.find('textarea.chat-input');

        redactorify(inputEl, {
            height: 120,
            onChange: function () {
                var element = composerEl.find('[component="chat/message/remaining"]');
                var curLength = utils.stripHTMLTags(this.code.get()).length;
                element.text(config.maximumChatMessageLength - curLength);
            }
        });
    });

    $(window).on('action:chat.sent', function (e, data) {
        // Empty chat input
        var redactor = $('.chat-modal[data-roomid="' + data.roomId + '"] .chat-input, .expanded-chat[data-roomid="' + data.roomId + '"] .chat-input');
        redactor.each(function () {
            $(this).redactor('core.object').code.set('');
        });
    });

    // Topic Thumb
    $.Redactor.prototype.topic_thumb = function () {
        return {
            init: function () {
              var that = this;
              translator.translate('[[topic:composer.thumb_title]]', function (translated) {
                var btnEl = that.button.add('topic_thumb', translated);
                that.button.setIcon(btnEl, '<i class="fa fa-th-large topic-thumb-btn topic-thumb-toggle-btn"></i>');
              });
            }
        };
    };

    $.Redactor.prototype.underline = function()
    {
        return {
            init: function()
            {
                var button = this.button.addAfter('italic', 'underline', 'U');
                this.button.addCallback(button, this.underline.format);
            },
            format: function()
            {
                this.inline.format('u');
            }
        };
    };

    $.Redactor.prototype.iconic = function()
    {
        return {
            init: function ()
            {
                var icons = {
                    'format': '<i class="fa fa-paragraph"></i>',
                    'ol': '<i class="fa fa-list-ol"></i>',
                    'ul': '<i class="fa fa-list-ul"></i>',
                    'link': '<i class="fa fa-link"></i>',
                    'horizontalrule': '<i class="fa fa-minus"></i>',
                    'image': '<i class="fa fa-picture-o"></i>',
                    'indent': '<i class="fa fa-indent"></i>',
                    'outdent': '<i class="fa fa-outdent"></i>',
                    'emoticons': '<i class="fa fa-smile-o"></i>',
                    'video': '<i class="fa fa-video-camera"></i>',
                    'file': '<i class="fa fa-upload"></i>',
                    'table': '<i class="fa fa-table"></i>'
                };

                $.each(this.button.all(), $.proxy(function(i,s)
                {
                    var key = $(s).attr('rel');

                    if (typeof icons[key] !== 'undefined')
                    {
                        var icon = icons[key];
                        var button = this.button.get(key);
                        this.button.setIcon(button, icon);
                    }

                }, this));
            }
        };
    };

    // Redactor Options
    $.Redactor.opts.buttons.splice($.Redactor.opts.buttons.indexOf('lists'), 1, 'horizontalrule', 'ol', 'ul', 'indent', 'outdent');
    $.Redactor.opts.plugins = ['video', 'table', 'topic_thumb', 'underline', 'emoticons', 'iconic'];
    $.Redactor.opts.focusEnd = true;
    $.Redactor.opts.imageUpload = config.relative_path + '/api/post/upload';
    $.Redactor.opts.imageUploadParam = 'files[]';
    $.Redactor.opts.imageUploadKey = 'url';

    if (config.allowFileUploads) {
        $.Redactor.opts.fileUpload = config.relative_path + '/api/post/upload';
        $.Redactor.opts.fileUploadParam = 'files[]';
    }

    var redactor = {};
    redactor.addQuote = function (tid, pid, title, username, text) {

        var uuid = composer.findByTid(tid) || composer.active;
        var escapedTitle = (title || '').replace(/([\\`*_{}\[\]()#+\-.!])/g, '\\$1').replace(/\[/g, '&#91;').replace(/\]/g, '&#93;').replace(/%/g, '&#37;').replace(/,/g, '&#44;');

        if (text) {
            text = "<blockquote>" + text + "</blockquote>";
        }

        if (uuid === undefined) {
            return composer.newReply(tid, pid, title, '[[modules:composer.user_said, ' + username + ']]\n' + text + '<p>&nbsp;</p>');
        } else if (uuid !== composer.active) {
            // If the composer is not currently active, activate it
            composer.load(uuid);
        }

        // There is a composer open already, append this blockquote to the text
        var postContainer = $('.composer[data-uuid="' + uuid + '"]');
        var bodyEl = postContainer.find('textarea');
        var prevText = bodyEl.val();
        translator.translate('[[modules:composer.user_said, ' + username + ']]\n', config.defaultLang, onTranslated);

        function onTranslated(translated) {
            composer.posts[uuid].body = (prevText.length ? prevText + '\n\n' : '') + translated + text + '<p>&nbsp;</p>';
            bodyEl.redactor('insert.html', translated + text + '<p>&nbsp;</p>');
            bodyEl.redactor('focus.end');
        }
    };
    return redactor;
});
