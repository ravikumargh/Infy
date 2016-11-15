(function () {
  'use strict';

  angular
    .module('cities.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.cities', {
        abstract: true,
        url: '/cities',
        template: '<ui-view/>'
      })
      .state('admin.cities.list', {
        url: '',
        templateUrl: '/modules/cities/client/views/list-cities.client.view.html',
        controller: 'CitiesController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
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
