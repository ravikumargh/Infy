// (function () {
//   'use strict';

//   angular
//     .module('outlets.admin.routes')
//     .config(routeConfig);

//   routeConfig.$inject = ['$stateProvider'];

//   function routeConfig($stateProvider) {
//     $stateProvider
//       .state('admin.outlets', {
//         abstract: true,
//         url: '/outlets',
//         template: '<ui-view/>'
//       })
//       .state('admin.outlets.list', {
//         url: '',
//         templateUrl: '/modules/outlets/client/views/list-outlets.client.view.html',
//         controller: 'OutletsController',
//         controllerAs: 'vm',
//         data: {
//           roles: ['admin']
//         }
//       })




//       // .state('admin.outlets', {
//       //   url: '/outlets',
//       //   templateUrl: '/modules/outlets/client/views/admin/list-outlets.client.view.html',
//       //   controller: 'OutletsController',
//       //   controllerAs: 'vm',
//       //   data: {
//       //     pageTitle: 'Outlets List'
//       //   }
//       // })
//       .state('admin.newoutlet', {
//         url: '/outlets/new',
//         templateUrl: '/modules/outlets/client/views/new-outlet.client.view.html',
//         controller: 'OutletsController',
//         controllerAs: 'vm',
//         resolve: {
//           outletResolve: newOutlet
//         },
//         data: {
//           pageTitle: 'New Outlet', roles: ['admin']
//         }
//       })
//       .state('admin.outlet', {
//         url: '/outlets/:outletId',
//         templateUrl: '/modules/outlets/client/views/view-outlet.client.view.html',
//         controller: 'OutletsController',
//         controllerAs: 'vm',
//         resolve: {
//           outletResolve: getOutlet
//         },
//         data: {
//           pageTitle: 'Edit {{ outletResolve.displayName }}'
//         }
//       })
//       .state('admin.outlet-edit', {
//         url: '/outlets/:outletId/edit',
//         templateUrl: '/modules/outlets/client/views/new-outlet.client.view.html',
//         controller: 'OutletsController',
//         controllerAs: 'vm',
//         resolve: {
//           outletResolve: getOutlet
//         },
//         data: {
//           pageTitle: 'Edit Outlet {{ outletResolve.displayName }}', roles: ['admin']
//         }
//       });

//   }

//   getOutlet.$inject = ['$stateParams', 'OutletsService'];

//   function getOutlet($stateParams, OutletsService) {
//     return OutletsService.get({
//       outletId: $stateParams.outletId
//     }).$promise;
//   }

//   newOutlet.$inject = ['OutletsService'];

//   function newOutlet(OutletsService) {
//     return new OutletsService();
//   }
// } ());
