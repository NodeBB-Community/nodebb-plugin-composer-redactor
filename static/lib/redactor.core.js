'use strict';

/* globals define, socket, app, config, ajaxify, utils, templates, bootbox */

define('redactor', [
    'composer',
    'translator',
    'composer/autocomplete',
    'composer/resize',
    'scrollStop'
], function (composer, translator, autocomplete, resize, scrollStop) {

    $(window).on('action:composer.loaded', function (ev, data) {
        var postContainer = $('#cmp-uuid-' + data.post_uuid),
            textarea = postContainer.find('textarea');

        $(window).trigger('action:redactor.load', $.Redactor);
        $(window).off('action:redactor.load');

        textarea.redactor({
          imageUploadFields: {
            'cid': '#cmp-cid-' + data.post_uuid,
            '_csrf': config.csrf_token
          },
          fileUploadFields: {
            'cid': '#cmp-cid-' + data.post_uuid,
            '_csrf': config.csrf_token
          }
        });

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

        postContainer.find('.redactor-editor').addClass('write');

        scrollStop.apply(postContainer.find('.redactor-editor'));
        autocomplete.init(postContainer);

        resize.reposition(postContainer);
    });

    $(window).on('action:composer.submit', function (e, data) {
        // Remove all empty paragraph blocks from composer content
        data.composerData.content = data.composerData.content.replace(/<p>(<br>| )+<\/p>/gm, '');
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
        $.Redactor.opts.fileUpload = '/api/post/upload';
        $.Redactor.opts.fileUploadParam = 'files[]';
    }

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
        var postContainer = $('#cmp-uuid-' + uuid);
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
