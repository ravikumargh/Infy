(function () {
  'use strict';

  angular
    .module('matrixes.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('matrix', {
        url: '/matrix',
        templateUrl: '/modules/matrixes/client/views/matrix.client.view.html',
        controller: 'MatrixMainController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Matrix'
        }
      })
      .state('categorymatrix', {
        url: '/matrix/category/:categoryId',
        templateUrl: '/modules/matrixes/client/views/matrix.client.view.html',
        controller: 'MatrixMainController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Matrix'
        }
      });
  }
} ());
