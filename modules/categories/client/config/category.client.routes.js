(function () {
  'use strict';

  angular
    .module('categories.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
     .state('admin.categories', {
        abstract: true,
        url: '/categories',
        template: '<ui-view/>'
      })
      .state('admin.categories.list', {
        url: '',
        templateUrl: '/modules/categories/client/views/list-categories.client.view.html',
        controller: 'CategoriesController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
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
