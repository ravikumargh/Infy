(function () {
  'use strict';

  angular
    .module('browsers')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Browsers',
      state: 'browsers'
    });
  }
}());
