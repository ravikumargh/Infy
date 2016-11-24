(function () {
  'use strict';
angular
    .module('outlets.services')
    .factory('OutletsService', OutletsService);

  OutletsService.$inject = ['$resource', '$log'];

  function OutletsService($resource, $log) {
    var Outlet = $resource('/api/outlets/:outletId', {
      outletId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Outlet.prototype, {
      createOrUpdate: function () {
        var outlet = this;
        return createOrUpdate(outlet);
      }
    });

    return Outlet;

    function createOrUpdate(outlet) {
      if (outlet._id) {
        return outlet.$update(onSuccess, onError);
      } else {
        return outlet.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(outlet) {
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

  angular
    .module('outlets.services')
    .factory('ShopOutletsService', ShopOutletsService);

  ShopOutletsService.$inject = ['$resource', '$log'];

  function ShopOutletsService($resource, $log) {
    var Outlet = $resource('/api/shops/:shopId/outlets/:outletId', {
      shopId: 'shop',
      outletId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    
    return Outlet;
    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
