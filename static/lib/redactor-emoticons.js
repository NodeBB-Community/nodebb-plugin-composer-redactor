/*
 * Redactor emoticon plugin.
 * Copyright (c) 2013 Tommy Brunn (tommy.brunn@gmail.com)
 * https://github.com/Nevon/redactor-emoticons
 */



(function($)
{
	$.Redactor.prototype.emoticons= function()
	{
    var that = this;
	var RLANG = {};
	var path = "/plugins/nodebb-plugin-composer-redactor/images/";
	var viewType = 'modal';
	var emoticons = {
		exodo: [
			{ name: "Duck", src : path + "pato.gif", shortcode : ":duck:" },
			{ name: "Duck", src : path + "pato.gif", shortcode : ":duck:" },
			{ name: "Duck", src : path + "sirdance.gif", shortcode : ":sirdance:" },
			{ name: "Laugh", src : path + "laughing.gif", shortcode : "xD" }
		],
		animals: [
	    	{ name: "Dance", src : path + "sirdance.gif", shortcode : ":sirdance:" },
	   	 	{ name: "Laugh", src : path + "laughing.gif", shortcode : "xD" }
		]
	};
	
	
	
	//if (typeof RedactorPlugins === 'undefined') {
	 //   var RedactorPlugins = {};
	//}

    return {
        init: function() {
            redactor = this;
            "use strict";
            if (typeof(RLANG.emoticons) === 'undefined') {
                RLANG.emoticons = 'Insert emoticon';
            }

            // choose the view type: modal window or dropdown box
            switch (viewType) {
                case 'dropdown':
                    var mylist = {};
					for (var key in emoticons){
                    for (var i = 0; i < emoticons[key].length; i++) {
                        mylist[emoticons[key][i].name] = {
                            title: '<img data-code="' + emoticons[key][i].shortcode + '" src="' + emoticons[key][i].src + '" alt="' + emoticons[key][i].name + '" title="' + emoticons[key][i].shortcode + '" style="cursor:pointer;">',
                            callback: function(buttonName, buttonDOM, buttonObj) {
                                that.chooseSmile(buttonName, buttonDOM, buttonObj);
                            },
                            className: 'redactor_smile'
                        }
                    }
					}
                    this.button.add('emoticons', RLANG.emoticons, null, mylist
                            );
                    break
                default:
					var button = this.button.addAfter('image', 'emoticons', RLANG.emoticons);
					this.button.addCallback(button, function() {
                        if (that.emoticons().replaceSmileys() === 0) {
                            that.emoticons().createModal();
                        }
                    });
            }

            //Add icon to button
            $('a[rel=emoticons]').css({
                backgroundImage: ' url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QIXFAkhU/45rAAAAlNJREFUSMftVT1oU1EYPefF16QxKkkKkZqWd2+wwQhWEAQnB9G1FQfRzVF0UxfxZ7CDs1IRHYq6VEVRRCg4iRWnUAdbMZT70lpTWtGKYPPSJ+9zeS0lWH3VSem3XO695/sO5+O75wJr8d8Ho4Acx9lL8gjJbhHZCGAGwIsgCAYmJiaqv8qN/abwpnQ6fZfkSZLPReS2iNyzLOstgJ0k+zOZjMzNzb1ctYJisZjyfX9YRF57nnd8enq63owpFAqFIAgekxwyxpxeVe+UUreUUoPh1iqVSnaTuni45pRS77XWvT+rY63Qmi4APbZtnwjJhuv1+lR7e3smvD9gWdY3rXVftVqdEZFTItIXmcCyrF6STyqVyqfwKA4gnkgkYgBA0g5z4wCQzWYfktyilNoaiQBAUURGliYhFtvT0tKSN8Z8BADXdZ96ntdmjDkDAOVy+buIjALoai60bgWCOIDG4mZ8fHwBwMJyQK1W+9yU4wFIRFIgIh9IqkVMPp9PrDRpS+NIahGZitqiZyLSA8DSWp+3bftBLpdLLgd0dnZu833/ndZ6l+M43QDS2Wy2HPUdUGs9IiI35+fnB5LJ5B0Au0kOApgVke0ADpI8Z4zp11oPicgr13UvRlUgJI+RvJRKpfa7rnsIwFEACyKiSI6KyA5jzDWt9VURSXued3nVXhR60H2SjwBcMca8AYBSqWQ3Go19QRBcCKG9ruvO/pHZOY6TI3mW5GERWU/yq4i0AagAuN7a2npjbGzM/ys3XcR2dHRsjsViG4IgmJ2cnPyy9hn9G/EDW0nlPvgF9JwAAAAASUVORK5CYII=)'
            });

            $('img').css({
                'cursor': 'pointer'
            });
        },
        createModal: function() {
            "use strict";
            //var modal = '<div id="emoticon_drawer" style="padding: 10px;"><ul style="margin: 0; padding: 0;">';

			var modal = '<div class="modal-body" id="emoticon_drawer">
        		<div class="tabbable"> 
       	 			<ul class="nav nav-tabs">
      	  				<li class="active"><a href="#tab1" data-toggle="tab">Section 1</a></li>
      	  				<li><a href="#tab2" data-toggle="tab">Section 2</a></li>
       	 			</ul>
        			<div class="tab-content">'
			var tab = 0;
			for (var key in emoticons){
				tab++;
				if(tab==1) {modal += '<div class="tab-pane active" id="tab' + tab + '">';}
				else {modal += '<div class="tab-pane" id="tab' + tab + '">';}
            for (var i = 0; i < emoticons[key].length; i++) {
				
                modal += '<li style="display: inline-block; padding: 5px;"><img src="' + emoticons[key][i].src + '" alt="' + emoticons[key][i].name + '" title="' + emoticons[key][i].shortcode + '" style="cursor:pointer;"></li>';
            	
			}
				modal += '</div>';
			}
            
            modal += '</div></div></div>';

            redactor.modal.addTemplate(RLANG.emoticons, modal);
            redactor.modal.addCallback(RLANG.emoticons, function() {
                $('#emoticon_drawer img').click(function() {
                    redactor.modal.close();

                    redactor.selection.restore();
                    redactor.buffer.set();
                    redactor.insert.html('<img src="' + $(this).attr('src') + '" alt="' + $(this).attr('alt') + '">');
                    redactor.code.sync();
                });
            });
            redactor.modal.load(RLANG.emoticons, RLANG.emoticons, 300);

            redactor.selection.save();
            redactor.modal.show();
        },
        /*
         * @param redactor Redactor instance
         * @return int The number of smilies replaced
         */
        replaceSmileys: function() {
            "use strict";
            var html = redactor.selection.getHtml();
            var numberOfMatches = 0;

            //Replace all smileys within selected text.
			for (var key in emoticons){
            for (var i = 0; i < emoticons[key].length; i++) {
                //Take the shortcode and escape any characters that have
                //special meaning in regexp.
                var smileyStr = (emoticons[key][i].shortcode + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
                var pattern = new RegExp('(' + smileyStr + ')', 'g');

                //Perform the match twice. Once to count number of
                //occurrences, and once to do the replace.
                numberOfMatches += (html.match(pattern) || []).length;
                html = html.replace(pattern, '<img src="' + emoticons[key][i].src + '" alt="' + emoticons[key][i].name + '">');
            }
			}

            if (numberOfMatches > 0)
                redactor.insert.html(html);

            return numberOfMatches;
        },
        chooseSmile: function(buttonName, buttonDOM, buttonObj) {
            var imgObj = buttonDOM.find('img');
            redactor.selection.restore();
            redactor.buffer.set();
            redactor.image.insert('<img class="smile" src="' + imgObj.attr('src') + '" alt="' + imgObj.attr('alt') + '">');
            redactor.modal.close();
        }
    
	};
	};
})(jQuery);