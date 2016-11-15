(function () {
  'use strict';

  angular
    .module('brands.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.brands', {
        abstract: true,
        url: '/brands',
        template: '<ui-view/>'
      })
      .state('admin.brands.list', {
        url: '',
        templateUrl: '/modules/brands/client/views/list-brands.client.view.html',
        controller: 'BrandsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      });
  }

  getBrand.$inject = ['$stateParams', 'BrandsService'];

  function getBrand($stateParams, BrandsService) {
    return BrandsService.get({
      brandId: $stateParams.brandId
    }).$promise;
  }

  newBrand.$inject = ['BrandsService'];

  function newBrand(BrandsService) {
    return new BrandsService();
  }
}());
