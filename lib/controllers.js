'use strict';

var Controllers = {};

Controllers.renderAdminPage = function (req, res, next) {
	var redactor = module.parent.exports;

	redactor.checkCompatibility(function(err, checks) {
		res.render('admin/plugins/composer-redactor', {
			checks: checks
		});
	});
};

module.exports = Controllers;