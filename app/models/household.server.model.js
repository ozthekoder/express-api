'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Household Schema
 */
var HouseholdSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Household name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	users: [{
		type: Schema.ObjectId,
		ref: 'User'
	}]
});

mongoose.model('Household', HouseholdSchema);

