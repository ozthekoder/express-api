'use strict';

(function() {
	// Households Controller Spec
	describe('Households Controller Tests', function() {
		// Initialize global variables
		var HouseholdsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Households controller.
			HouseholdsController = $controller('HouseholdsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Household object fetched from XHR', inject(function(Households) {
			// Create sample Household using the Households service
			var sampleHousehold = new Households({
				name: 'New Household'
			});

			// Create a sample Households array that includes the new Household
			var sampleHouseholds = [sampleHousehold];

			// Set GET response
			$httpBackend.expectGET('households').respond(sampleHouseholds);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.households).toEqualData(sampleHouseholds);
		}));

		it('$scope.findOne() should create an array with one Household object fetched from XHR using a householdId URL parameter', inject(function(Households) {
			// Define a sample Household object
			var sampleHousehold = new Households({
				name: 'New Household'
			});

			// Set the URL parameter
			$stateParams.householdId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/households\/([0-9a-fA-F]{24})$/).respond(sampleHousehold);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.household).toEqualData(sampleHousehold);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Households) {
			// Create a sample Household object
			var sampleHouseholdPostData = new Households({
				name: 'New Household'
			});

			// Create a sample Household response
			var sampleHouseholdResponse = new Households({
				_id: '525cf20451979dea2c000001',
				name: 'New Household'
			});

			// Fixture mock form input values
			scope.name = 'New Household';

			// Set POST response
			$httpBackend.expectPOST('households', sampleHouseholdPostData).respond(sampleHouseholdResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Household was created
			expect($location.path()).toBe('/households/' + sampleHouseholdResponse._id);
		}));

		it('$scope.update() should update a valid Household', inject(function(Households) {
			// Define a sample Household put data
			var sampleHouseholdPutData = new Households({
				_id: '525cf20451979dea2c000001',
				name: 'New Household'
			});

			// Mock Household in scope
			scope.household = sampleHouseholdPutData;

			// Set PUT response
			$httpBackend.expectPUT(/households\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/households/' + sampleHouseholdPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid householdId and remove the Household from the scope', inject(function(Households) {
			// Create new Household object
			var sampleHousehold = new Households({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Households array and include the Household
			scope.households = [sampleHousehold];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/households\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleHousehold);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.households.length).toBe(0);
		}));
	});
}());