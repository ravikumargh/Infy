(function () {
  'use strict';

  angular
    .module('categories.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('categories', {
        url: '/categories',
        templateUrl: '/modules/categories/client/views/list-categories.client.view.html',
        controller: 'CategoriesController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'categories'
        },
        resolve: {
          categoryResolve: newCategory
        }
      });

  }

  getCategory.$inject = ['$stateParams', 'CategoriesService'];

  function getCategory($stateParams, CategoriesService) {
    return CategoriesService.get({
      articleId: $stateParams.articleId
    }).$promise;
  }

  newCategory.$inject = ['CategoriesService'];

  function newCategory(CategoriesService) {
    return new CategoriesService();
  }
} ());
