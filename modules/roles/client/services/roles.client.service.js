(function () {
  'use strict';

  angular
    .module('roles.services')
    .factory('RolesService', RolesService);

  RolesService.$inject = ['$resource', '$log'];

  function RolesService($resource, $log) {
    var Role = $resource('/api/roles/:roleId', {
      roleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Role.prototype, {
      createOrUpdate: function () {
        var role = this;
        return createOrUpdate(role);
      }
    });

    return Role;

    function createOrUpdate(role) {
      if (role._id) {
        return role.$update(onSuccess, onError);
      } else {
        return role.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(role) {
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
