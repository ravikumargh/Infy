(function () {
  'use strict';

  angular
    .module('brands.services')
    .factory('BrandsService', BrandsService);

  BrandsService.$inject = ['$resource', '$log'];

  function BrandsService($resource, $log) {
    var Brand = $resource('/api/brands/:brandId', {
      brandId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Brand.prototype, {
      createOrUpdate: function () {
        var brand = this;
        return createOrUpdate(brand);
      }
    });

    return Brand;

    function createOrUpdate(brand) {
      if (brand._id) {
        return brand.$update(onSuccess, onError);
      } else {
        return brand.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(brand) {
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
