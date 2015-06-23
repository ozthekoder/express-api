'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Household = mongoose.model('Household'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, household;

/**
 * Household routes tests
 */
describe('Household CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Household
		user.save(function() {
			household = {
				name: 'Household Name'
			};

			done();
		});
	});

	it('should be able to save Household instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Household
				agent.post('/households')
					.send(household)
					.expect(200)
					.end(function(householdSaveErr, householdSaveRes) {
						// Handle Household save error
						if (householdSaveErr) done(householdSaveErr);

						// Get a list of Households
						agent.get('/households')
							.end(function(householdsGetErr, householdsGetRes) {
								// Handle Household save error
								if (householdsGetErr) done(householdsGetErr);

								// Get Households list
								var households = householdsGetRes.body;

								// Set assertions
								(households[0].user._id).should.equal(userId);
								(households[0].name).should.match('Household Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Household instance if not logged in', function(done) {
		agent.post('/households')
			.send(household)
			.expect(401)
			.end(function(householdSaveErr, householdSaveRes) {
				// Call the assertion callback
				done(householdSaveErr);
			});
	});

	it('should not be able to save Household instance if no name is provided', function(done) {
		// Invalidate name field
		household.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Household
				agent.post('/households')
					.send(household)
					.expect(400)
					.end(function(householdSaveErr, householdSaveRes) {
						// Set message assertion
						(householdSaveRes.body.message).should.match('Please fill Household name');
						
						// Handle Household save error
						done(householdSaveErr);
					});
			});
	});

	it('should be able to update Household instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Household
				agent.post('/households')
					.send(household)
					.expect(200)
					.end(function(householdSaveErr, householdSaveRes) {
						// Handle Household save error
						if (householdSaveErr) done(householdSaveErr);

						// Update Household name
						household.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Household
						agent.put('/households/' + householdSaveRes.body._id)
							.send(household)
							.expect(200)
							.end(function(householdUpdateErr, householdUpdateRes) {
								// Handle Household update error
								if (householdUpdateErr) done(householdUpdateErr);

								// Set assertions
								(householdUpdateRes.body._id).should.equal(householdSaveRes.body._id);
								(householdUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Households if not signed in', function(done) {
		// Create new Household model instance
		var householdObj = new Household(household);

		// Save the Household
		householdObj.save(function() {
			// Request Households
			request(app).get('/households')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Household if not signed in', function(done) {
		// Create new Household model instance
		var householdObj = new Household(household);

		// Save the Household
		householdObj.save(function() {
			request(app).get('/households/' + householdObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', household.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Household instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Household
				agent.post('/households')
					.send(household)
					.expect(200)
					.end(function(householdSaveErr, householdSaveRes) {
						// Handle Household save error
						if (householdSaveErr) done(householdSaveErr);

						// Delete existing Household
						agent.delete('/households/' + householdSaveRes.body._id)
							.send(household)
							.expect(200)
							.end(function(householdDeleteErr, householdDeleteRes) {
								// Handle Household error error
								if (householdDeleteErr) done(householdDeleteErr);

								// Set assertions
								(householdDeleteRes.body._id).should.equal(householdSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Household instance if not signed in', function(done) {
		// Set Household user 
		household.user = user;

		// Create new Household model instance
		var householdObj = new Household(household);

		// Save the Household
		householdObj.save(function() {
			// Try deleting Household
			request(app).delete('/households/' + householdObj._id)
			.expect(401)
			.end(function(householdDeleteErr, householdDeleteRes) {
				// Set message assertion
				(householdDeleteRes.body.message).should.match('User is not logged in');

				// Handle Household error error
				done(householdDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Household.remove().exec();
		done();
	});
});