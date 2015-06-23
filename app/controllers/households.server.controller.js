'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Household = mongoose.model('Household'),
	User = mongoose.model('User'),
	_ = require('lodash'),
	Promise = require('bluebird');

	Promise.promisifyAll(Household);
	Promise.promisifyAll(Household.prototype);
	Promise.promisifyAll(User);
	Promise.promisifyAll(User.prototype);

/**
 * Create a Household
 */
exports.create = function(req, res) {
	var household = new Household(req.body);
	household.users.push(req.user);
	req.user.household = household;

	req.user = req.user.saveAsync();

	res.jsonp(household.saveAsync());

	//household.save(function(err) {
	//	if (err) {
	//		return res.status(400).send({
	//			message: errorHandler.getErrorMessage(err)
	//		});
	//	} else {
	//		res.jsonp(household);
	//	}
	//});
};

/**
 * Show the current Household
 */
exports.read = function(req, res) {
	res.jsonp(req.household);
};

/**
 * Update a Household
 */
exports.update = function(req, res) {
	var household = req.household ;

	household = _.extend(household , req.body);

	household.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(household);
		}
	});
};

/**
 * Delete an Household
 */
exports.delete = function(req, res) {
	var household = req.household ;

	household.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(household);
		}
	});
};

/**
 * List of Households
 */
exports.list = function(req, res) { 
	Household.find().sort('-created').populate('user', 'displayName').exec(function(err, households) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(households);
		}
	});
};

/**
 * Household middleware
 */
exports.householdByID = function(req, res, next, id) { 
	Household.findById(id).populate('user', 'displayName').exec(function(err, household) {
		if (err) return next(err);
		if (! household) return next(new Error('Failed to load Household ' + id));
		req.household = household ;
		next();
	});
};

/**
 * Household authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.household.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
