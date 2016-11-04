(function () {
  'use strict';

  angular
    .module('operatingsystems.services')
    .factory('OperatingSystemsService', OperatingSystemsService);

  OperatingSystemsService.$inject = ['$resource', '$log'];

  function OperatingSystemsService($resource, $log) {
    var OperatingSystem = $resource('/api/operatingsystems/:operatingsystemId', {
      operatingsystemId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(OperatingSystem.prototype, {
      createOrUpdate: function () {
        var operatingsystem = this;
        return createOrUpdate(operatingsystem);
      }
    });

    return OperatingSystem;

    function createOrUpdate(operatingsystem) {
      if (operatingsystem._id) {
        return operatingsystem.$update(onSuccess, onError);
      } else {
        return operatingsystem.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(operatingsystem) {
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
