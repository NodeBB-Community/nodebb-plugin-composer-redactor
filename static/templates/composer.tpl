<div component="composer" class="composer<!-- IF resizable --> resizable<!-- ENDIF resizable -->"<!-- IF !disabled --> style="visibility: inherit;"<!-- ENDIF !disabled -->>

	<div class="composer-container">
		<nav class="navbar navbar-fixed-top mobile-navbar hidden-md hidden-lg">
			<div>
				<button class="btn btn-sm btn-primary composer-discard" data-action="discard" tabindex="-1"><i class="fa fa-times"></i></button>
				<button class="btn btn-sm btn-primary composer-minimize" data-action="minimize" tabindex="-1"><i class="fa fa-minus"></i></button>
			</div>
			<!-- IF isTopic -->
			<div class="category-name-container">
				<span class="category-name"></span> <i class="fa fa-sort"></i>
			</div>
			<!-- ENDIF isTopic -->
			<div>
				<button class="btn btn-sm btn-primary composer-submit" data-action="post" tabindex="-1"><i class="fa fa-chevron-right"></i></button>
			</div>
		</nav>

		<div class="row title-container">
			{{{ if isTopic }}}
			<div class="category-list-container hidden-sm hidden-xs">
				<!-- IMPORT partials/category-selector.tpl -->
			</div>
			{{{ end }}}

			<!-- IF showHandleInput -->
			<div data-component="composer/handle">
				<input class="handle form-control" type="text" tabindex="1" placeholder="[[topic:composer.handle_placeholder]]" value="{handle}" />
			</div>
			<!-- ENDIF showHandleInput -->
			<div data-component="composer/title">
				<!-- IF isTopicOrMain -->
				<input class="title form-control" type="text" tabindex="1" placeholder="[[topic:composer.title_placeholder]]" value="{title}"/>
				<!-- ELSE -->
				<span class="title form-control">[[topic:composer.replying_to, "{title}"]]</span>
				<!-- ENDIF isTopicOrMain -->
				<div id="quick-search-container" class="quick-search-container hidden">
					<div class="text-center loading-indicator"><i class="fa fa-spinner fa-spin"></i></div>
					<div class="quick-search-results-container"></div>
				</div>
			</div>

			<div class="pull-right draft-icon hidden-xs hidden-sm"></div>

			<!-- Unavailable for now -->
			<!-- <div class="display-scheduler pull-right hidden-sm hidden-xs{{{ if !canSchedule }}} hidden{{{ end }}}">
				<i class="fa fa-clock-o"></i>
			</div> -->

			<div class="btn-group pull-right action-bar hidden-sm hidden-xs">
				<button class="btn btn-default composer-discard" data-action="discard" tabindex="-1"><i class="fa fa-times"></i> [[topic:composer.discard]]</button>

				<button class="btn btn-primary composer-submit" data-action="post" tabindex="6" data-text-variant=" [[topic:composer.schedule]]"><i class="fa fa-check"></i> [[topic:composer.submit]]</button>
			</div>
		</div>

		<span class="write-container">
			<textarea></textarea>
		</span>

		<!-- IF isTopicOrMain -->
		<div class="tag-row">
			<div class="tags-container">
				<div class="btn-group dropup <!-- IF !tagWhitelist.length -->hidden<!-- ENDIF !tagWhitelist.length -->" component="composer/tag/dropdown">
					<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">
						<span class="visible-sm-inline visible-md-inline visible-lg-inline"><i class="fa fa-tags"></i></span>
						[[tags:select_tags]]
					</button>

					<ul class="dropdown-menu">
						<!-- BEGIN tagWhitelist -->
						<li data-tag="{@value}"><a href="#">{@value}</a></li>
						<!-- END tagWhitelist -->
					</ul>
				</div>
				<input class="tags" type="text" class="form-control" placeholder="[[tags:enter_tags_here, {minimumTagLength}, {maximumTagLength}]]" tabindex="5"/>
			</div>
		</div>
		<!-- ENDIF isTopicOrMain -->

		<div class="resizer">
			<div class="trigger text-center"><i class="fa"></i></div>
		</div>
	</div>
</div>
