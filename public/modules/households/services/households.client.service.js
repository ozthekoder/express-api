'use strict';

//Households service used to communicate Households REST endpoints
angular.module('households').factory('Households', ['$resource',
	function($resource) {
		return $resource('households/:householdId', { householdId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);