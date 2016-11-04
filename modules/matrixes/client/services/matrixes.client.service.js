(function () {
  'use strict';

  angular
    .module('matrixes.services')
    .factory('MatrixesService', MatrixesService);

  MatrixesService.$inject = ['$resource', '$log'];

  function MatrixesService($resource, $log) {
    var Matrix = $resource('/api/matrixes/:matrixId', {
      matrixId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Matrix.prototype, {
      createOrUpdate: function () {
        var matrix = this;
        return createOrUpdate(matrix);
      }
    });

    return Matrix;

    function createOrUpdate(matrix) {
      if (matrix._id) {
        return matrix.$update(onSuccess, onError);
      } else {
        return matrix.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(matrix) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());


(function () {
  'use strict';

  angular
    .module('matrixes.category.services')
    .factory('MatrixResource', MatrixResource);

  MatrixResource.$inject = ['$resource', '$log'];

  function MatrixResource($resource, $log) {
    var Matrix = $resource('/api/matrix/:categoryId', {
      categoryId: '@category'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Matrix.prototype, {
      createOrUpdate: function () {
        var matrix = this;
        return createOrUpdate(matrix);
      }
    });

    return Matrix;

    function createOrUpdate(matrix) {
      if (matrix._id) {
        return matrix.$update(onSuccess, onError);
      } else {
        return matrix.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(matrix) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
