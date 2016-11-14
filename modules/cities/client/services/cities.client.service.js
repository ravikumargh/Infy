(function () {
  'use strict';

  angular
    .module('cities.services')
    .factory('CitiesService', CitiesService);

  CitiesService.$inject = ['$resource', '$log'];

  function CitiesService($resource, $log) {
    var City = $resource('/api/cities/:cityId', {
      cityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(City.prototype, {
      createOrUpdate: function () {
        var city = this;
        return createOrUpdate(city);
      }
    });

    return City;

    function createOrUpdate(city) {
      if (city._id) {
        return city.$update(onSuccess, onError);
      } else {
        return city.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(city) {
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
