'use strict';

// Households controller
angular.module('households').controller('HouseholdsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Households',
	function($scope, $stateParams, $location, Authentication, Households) {
		$scope.authentication = Authentication;

		// Create new Household
		$scope.create = function() {
			// Create new Household object
			var household = new Households ({
				name: this.name
			});

			// Redirect after save
			household.$save(function(response) {
				$location.path('households/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Household
		$scope.remove = function(household) {
			if ( household ) { 
				household.$remove();

				for (var i in $scope.households) {
					if ($scope.households [i] === household) {
						$scope.households.splice(i, 1);
					}
				}
			} else {
				$scope.household.$remove(function() {
					$location.path('households');
				});
			}
		};

		// Update existing Household
		$scope.update = function() {
			var household = $scope.household;

			household.$update(function() {
				$location.path('households/' + household._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Households
		$scope.find = function() {
			$scope.households = Households.query();
		};

		// Find existing Household
		$scope.findOne = function() {
			$scope.household = Households.get({ 
				householdId: $stateParams.householdId
			});
		};
	}
]);