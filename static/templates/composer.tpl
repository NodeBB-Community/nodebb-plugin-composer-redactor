<div component="composer" class="composer<!-- IF resizable --> resizable<!-- ENDIF resizable -->"<!-- IF !disabled --> style="visibility: inherit;"<!-- ENDIF !disabled -->>

    <div class="composer-container">
        <nav class="navbar navbar-fixed-top mobile-navbar visible-xs visible-sm">
		<div class="pull-left">
			<button class="btn btn-sm btn-primary composer-discard" data-action="discard" tabindex="-1"><i class="fa fa-times"></i></button>
		</div>
		<!-- IF isTopic -->
		<div class="category-name-container">
			<span class="category-name"></span> <i class="fa fa-sort"></i>
		</div>
		<!-- ENDIF isTopic -->
		<div class="pull-right">
			<button class="btn btn-sm btn-primary composer-submit" data-action="post" tabindex="-1"><i class="fa fa-chevron-right"></i></button>
		</div>
        </nav>
        <div class="title-container row">
            <!-- IF showHandleInput -->
            <div class="col-sm-3 col-md-12">
                <input class="handle form-control" type="text" tabindex="1"
                       placeholder="[[topic:composer.handle_placeholder]]" value="{handle}"/>
            </div>
            <div class="col-sm-9 col-md-12">
                <!-- IF isTopicOrMain -->
                <input class="title form-control" type="text" tabindex="1"
                       placeholder="[[topic:composer.title_placeholder]]" value="{title}"/>
                <!-- ELSE -->
                <span class="title form-control">[[topic:composer.replying_to, "{title}"]]</span>
                <!-- ENDIF isTopicOrMain -->
            </div>
            <!-- ELSE -->
            <div class="<!-- IF isTopic -->col-lg-9<!-- ELSE -->col-lg-12<!-- ENDIF isTopic --> col-md-12">
                <!-- IF isTopicOrMain -->
                <input class="title form-control" type="text" tabindex="1"
                       placeholder="[[topic:composer.title_placeholder]]" value="{title}"/>
                <!-- ELSE -->
                <span class="title form-control">[[topic:composer.replying_to, "{title}"]]</span>
                <!-- ENDIF isTopicOrMain -->
            </div>
            <!-- IF isTopic -->
            <div class="category-list-container col-lg-3 col-md-12 hidden-sm hidden-xs">
                <select tabindex="3" class="form-control category-list"></select>
            </div>
            <!-- ENDIF isTopic -->
            <!-- ENDIF showHandleInput -->
        </div>

        <div class="row category-tag-row">
            <div class="btn-toolbar formatting-bar">
                <div class="btn-group pull-right action-bar hidden-sm hidden-xs">
                    <button class="btn btn-default composer-discard" data-action="discard" tabindex="-1"><i
                                class="fa fa-times"></i> [[topic:composer.discard]]
                    </button>

                    <button class="btn btn-primary composer-submit" data-action="post" tabindex="6"><i
                                class="fa fa-check"></i> [[topic:composer.submit]]
                    </button>
                </div>

                <!-- IF isTopicOrMain -->
                <div class="tags-container inline-block">
                    <input class="tags" type="text" class="form-control"
                           placeholder="[[tags:enter_tags_here, {minimumTagLength}, {maximumTagLength}]]" tabindex="4"/>
                </div>
                <!-- IF allowTopicsThumbnail -->
                  <div class="topic-thumb-container center-block hide">
                    <form id="thumbForm" method="post" class="topic-thumb-form form-inline" enctype="multipart/form-data">
                      <img class="topic-thumb-preview"></img>
                      <div class="form-group topic-thumb-ctrl visible-xs">
                        <i class="fa fa-spinner fa-spin hide topic-thumb-spinner" title="[[topic:composer.uploading]]"></i>
                        <i class="fa fa-times topic-thumb-btn hide topic-thumb-clear-btn" title="[[topic:composer.thumb_remove]]"></i>
                      </div>
                      <div class="form-group">
                        <label for="topic-thumb-url">[[topic:composer.thumb_url_label]]</label>
                        <input type="text" id="topic-thumb-url" class="form-control" placeholder="[[topic:composer.thumb_url_placeholder]]" />
                      </div>
                      <div class="form-group">
                        <label for="topic-thumb-file">[[topic:composer.thumb_file_label]]</label>
                        <input type="file" id="topic-thumb-file" class="form-control" />
                      </div>
                      <div class="form-group topic-thumb-ctrl hidden-xs">
                        <i class="fa fa-spinner fa-spin hide topic-thumb-spinner" title="[[topic:composer.uploading]]"></i>
                        <i class="fa fa-times topic-thumb-btn hide topic-thumb-clear-btn" title="[[topic:composer.thumb_remove]]"></i>
                      </div>
                    </form>
                  </div>
                <!-- ENDIF allowTopicsThumbnail -->
                <!-- ENDIF isTopicOrMain -->
            </div>
        </div>
		<span class="topic">
            <span class="posts">
                <span class="content">
                    <span class="write-container">
                        <textarea></textarea>
                    </span>
		        </span>
            </span>
		</span>
	
	<!-- IF isTopic -->
	<ul class="category-selector visible-xs visible-sm"></ul>
	<!-- ENDIF isTopic -->
		
        <div class="resizer">
            <div class="trigger text-center"><i class="fa"></i></div>
        </div>
    </div>
</div>
