(function () {
  'use strict';

  angular
    .module('cities')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Cities',
      state: 'cities'
    });
  }
}());
