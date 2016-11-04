(function () {
  'use strict';

  angular
    .module('products.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('products', {
        url: '/products',
        templateUrl: '/modules/products/client/views/list-products.client.view.html',
        controller: 'ProductsController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Products'
        },
        resolve: {
          productResolve: newProduct
        }
      });

  }

  getProduct.$inject = ['$stateParams', 'ProductsService'];

  function getProduct($stateParams, ProductsService) {
    return ProductsService.get({
      articleId: $stateParams.articleId
    }).$promise;
  }

  newProduct.$inject = ['ProductsService'];

  function newProduct(ProductsService) {
    return new ProductsService();
  }
} ());
