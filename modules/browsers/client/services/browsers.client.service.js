(function () {
  'use strict';

  angular
    .module('browsers.services')
    .factory('BrowsersService', BrowsersService);

  BrowsersService.$inject = ['$resource', '$log'];

  function BrowsersService($resource, $log) {
    var Browser = $resource('/api/browsers/:browserId', {
      browserId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Browser.prototype, {
      createOrUpdate: function () {
        var browser = this;
        return createOrUpdate(browser);
      }
    });

    return Browser;

    function createOrUpdate(browser) {
      if (browser._id) {
        return browser.$update(onSuccess, onError);
      } else {
        return browser.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(browser) {
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
