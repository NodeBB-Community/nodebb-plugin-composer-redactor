<div class="row">
	<div class="col-lg-9">
		<div class="panel panel-default">
			<div class="panel-heading">Redactor Composer</div>
			<div class="panel-body">
				<p>
					<a href="http://imperavi.com/redactor/">Redactor</a> is a WYSIWYG composer allowing users to create posts via a rich-text interface.
					Unlike the composer shipping by default with NodeBB, no knowledge of Markdown is required by the end user.
				</p>
				<p>
					<strong>Quick Links</strong>
					<ul>
						<li><a href="http://imperavi.com/redactor/">Redactor Home Page</a></li>
						<li><a href="http://imperavi.com/redactor/docs/">Documentation</a></li>
					</ul>
				</p>
			</div>
		</div>
		<div class="panel panel-default">
			<div class="panel-heading">Compatibility Checks</div>
			<div class="panel-body">
				<ul class="list-group">
					<li class="list-group-item list-group-item-<!-- IF checks.markdown -->success<!-- ELSE -->danger<!--ENDIF checks.markdown -->">
						<strong>Markdown Compatibility</strong>
						<!-- IF checks.markdown -->
						<span class="badge"><i class="fa fa-check"></i></span>
						<p>The Markdown plugin is either disabled, or HTML sanitization is disabled</p>
						<!-- ELSE -->
						<span class="badge"><i class="fa fa-times"></i></span>
						<p>
							In order to render post content correctly, the Markdown plugin needs to have HTML sanitization disabled,
							or the entire plugin should be disabled altogether.
						</p>
						<!-- ENDIF checks.markdown -->
					</li>
					<li class="list-group-item list-group-item-<!-- IF checks.composer -->success<!-- ELSE -->danger<!--ENDIF checks.composer -->">
						<strong>Composer Conflicts</strong>
						<!-- IF checks.composer -->
						<span class="badge"><i class="fa fa-check"></i></span>
						<p>Great! Looks like Redactor is the only composer active</p>
						<!-- ELSE -->
						<span class="badge"><i class="fa fa-times"></i></span>
						<p>Redactor must be the only composer active. Please disable other composers and reload NodeBB.</p>
						<!-- ENDIF checks.composer -->
					</li>
				</ul>
			</div>
		</div>
	</div>
	<div class="col-lg-3">
		<div class="panel panel-default">
			<div class="panel-heading">Control Panel</div>
			<div class="panel-body">
				<button class="btn btn-primary" id="save">Save Settings</button>
			</div>
		</div>
	</div>
</div>
