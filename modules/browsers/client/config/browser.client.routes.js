(function () {
  'use strict';

  angular
    .module('browsers.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('browsers', {
        url: '/browsers',
        templateUrl: '/modules/browsers/client/views/list-browsers.client.view.html',
        controller: 'BrowsersController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Browsers'
        },
        resolve: {
          browserResolve: newBrowser
        }
      });

  }

  getBrowser.$inject = ['$stateParams', 'BrowsersService'];

  function getBrowser($stateParams, BrowsersService) {
    return BrowsersService.get({
      articleId: $stateParams.articleId
    }).$promise;
  }

  newBrowser.$inject = ['BrowsersService'];

  function newBrowser(BrowsersService) {
    return new BrowsersService();
  }
} ());
