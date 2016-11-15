(function () {
  'use strict';

  angular
    .module('departments.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
    .state('admin.departments', {
        abstract: true,
        url: '/departments',
        template: '<ui-view/>'
      })
      .state('admin.departments.list', {
        url: '',
        templateUrl: '/modules/departments/client/views/list-departments.client.view.html',
        controller: 'DepartmentsController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      });

  }

  getDepartment.$inject = ['$stateParams', 'DepartmentsService'];

  function getDepartment($stateParams, DepartmentsService) {
    return DepartmentsService.get({
      articleId: $stateParams.articleId
    }).$promise;
  }

  newDepartment.$inject = ['DepartmentsService'];

  function newDepartment(DepartmentsService) {
    return new DepartmentsService();
  }
} ());
