'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var households = require('../../app/controllers/households.server.controller');

	// Households Routes
	app.route('/households')
		.get(households.list)
		.post(users.requiresLogin, households.create);

	app.route('/households/:householdId')
		.get(households.read)
		.put(users.requiresLogin, households.hasAuthorization, households.update)
		.delete(users.requiresLogin, households.hasAuthorization, households.delete);

	// Finish by binding the Household middleware
	app.param('householdId', households.householdByID);
};
