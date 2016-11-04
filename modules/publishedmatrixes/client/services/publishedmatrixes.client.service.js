(function () {
  'use strict';

//PublishedMatrix service used for communicating with the publishedmatrix REST endpoints
angular.module('publishedmatrixes.services').factory('PublishedMatrix', ['$resource',
	function($resource) {
		return $resource('/api/publishedmatrix/:publishedmatrixid', {
			publishedmatrixid: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('publishedmatrixes.services').factory('PublishedMatrixResource', ['$resource',
	function($resource) {
		return $resource('/api/publishedmatrix/:categoryId', {
			categoryId: '@category'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

 
}());
