'use strict';

//Setting up route
angular.module('households').config(['$stateProvider',
	function($stateProvider) {
		// Households state routing
		$stateProvider.
		state('listHouseholds', {
			url: '/households',
			templateUrl: 'modules/households/views/list-households.client.view.html'
		}).
		state('createHousehold', {
			url: '/households/create',
			templateUrl: 'modules/households/views/create-household.client.view.html'
		}).
		state('viewHousehold', {
			url: '/households/:householdId',
			templateUrl: 'modules/households/views/view-household.client.view.html'
		}).
		state('editHousehold', {
			url: '/households/:householdId/edit',
			templateUrl: 'modules/households/views/edit-household.client.view.html'
		});
	}
]);