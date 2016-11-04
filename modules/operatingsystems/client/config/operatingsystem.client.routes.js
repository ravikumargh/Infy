(function () {
  'use strict';

  angular
    .module('operatingsystems.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('operatingsystems', {
        url: '/operatingsystems',
        templateUrl: '/modules/operatingsystems/client/views/list-operatingsystems.client.view.html',
        controller: 'OperatingSystemsController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'OperatingSystems'
        },
        resolve: {
          operatingsystemResolve: newOperatingSystem
        }
      });
      
  }

  getOperatingSystem.$inject = ['$stateParams', 'OperatingSystemsService'];

  function getOperatingSystem($stateParams, OperatingSystemsService) {
    return OperatingSystemsService.get({
      articleId: $stateParams.articleId
    }).$promise;
  }

  newOperatingSystem.$inject = ['OperatingSystemsService'];

  function newOperatingSystem(OperatingSystemsService) {
    return new OperatingSystemsService();
  }
}());
