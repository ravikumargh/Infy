(function () {
  'use strict';

  angular
    .module('roles.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.roles', {
        abstract: true,
        url: '/roles',
        template: '<ui-view/>'
      })
      .state('admin.roles.list', {
        url: '',
        templateUrl: '/modules/roles/client/views/list-roles.client.view.html',
        controller: 'RolesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      });
  }

  getRole.$inject = ['$stateParams', 'RolesService'];

  function getRole($stateParams, RolesService) {
    return RolesService.get({
      roleId: $stateParams.roleId
    }).$promise;
  }

  newRole.$inject = ['RolesService'];

  function newRole(RolesService) {
    return new RolesService();
  }
}());
