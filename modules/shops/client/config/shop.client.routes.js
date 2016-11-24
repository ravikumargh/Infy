(function () {
  'use strict';

  angular
    .module('shops.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.shops', {
        abstract: true,
        url: '/shops',
        template: '<ui-view/>'
      })
      .state('admin.shops.list', {
        url: '',
        templateUrl: '/modules/shops/client/views/list-shops.client.view.html',
        controller: 'ShopsController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })




      // .state('admin.shops', {
      //   url: '/shops',
      //   templateUrl: '/modules/shops/client/views/admin/list-shops.client.view.html',
      //   controller: 'ShopsController',
      //   controllerAs: 'vm',
      //   data: {
      //     pageTitle: 'Shops List'
      //   }
      // })
      .state('admin.newshop', {
        url: '/shops/new',
        templateUrl: '/modules/shops/client/views/new-shop.client.view.html',
        controller: 'ShopsController',
        controllerAs: 'vm',
        resolve: {
          shopResolve: newShop
        },
        data: {
          pageTitle: 'New Shop', roles: ['admin']
        }
      })
      .state('admin.newoutlet', {
        url: '/shops/:shopId/outlets/new',
        templateUrl: '/modules/shops/client/views/outlet/new-outlet.client.view.html',
        controller: 'OutletsController',
        controllerAs: 'vm',
        resolve: {
          outletResolve: newOutlet
        },
        data: {
          pageTitle: 'New Outlet', roles: ['admin']
        }
      })
      .state('admin.shop', {
        url: '/shops/:shopId',
        templateUrl: '/modules/shops/client/views/view-shop.client.view.html',
        controller: 'ShopsController',
        controllerAs: 'vm',
        resolve: {
          shopResolve: getShop
        },
        data: {
          pageTitle: 'Edit {{ shopResolve.displayName }}'
        }
      })
      .state('admin.outlet', {
        url: '/shops/:shopId/outlets/:outletId',
        templateUrl: '/modules/shops/client/views/outlet/view-outlet.client.view.html',
        controller: 'OutletsController',
        controllerAs: 'vm',
        resolve: {
          shopResolve: getShop
        },
        data: {
          pageTitle: 'Edit {{ shopResolve.displayName }}'
        }
      })
      .state('admin.shop-edit', {
        url: '/shops/:shopId/edit',
        templateUrl: '/modules/shops/client/views/new-shop.client.view.html',
        controller: 'ShopsController',
        controllerAs: 'vm',
        resolve: {
          shopResolve: getShop
        },
        data: {
          pageTitle: 'Edit Shop {{ shopResolve.displayName }}', roles: ['admin']
        }
      });

  }

  getShop.$inject = ['$stateParams', 'ShopsService'];

  function getShop($stateParams, ShopsService) {
    return ShopsService.get({
      shopId: $stateParams.shopId
    }).$promise;
  }

  newShop.$inject = ['ShopsService'];
  newOutlet.$inject = ['OutletsService'];

  function newShop(ShopsService) {
    return new ShopsService();
  }
  function newOutlet(OutletsService) {
    return new OutletsService();
  }
} ());
