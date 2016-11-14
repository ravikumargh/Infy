(function () {
  'use strict';

  angular
    .module('cities.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('cities', {
        url: '/cities',
        templateUrl: '/modules/cities/client/views/list-cities.client.view.html',
        controller: 'CitiesController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'cities'
        },
        resolve: {
          cityResolve: newCity
        }
      });

  }

  getCity.$inject = ['$stateParams', 'CitiesService'];

  function getCity($stateParams, CitiesService) {
    return CitiesService.get({
      articleId: $stateParams.articleId
    }).$promise;
  }

  newCity.$inject = ['CitiesService'];

  function newCity(CitiesService) {
    return new CitiesService();
  }
} ());
