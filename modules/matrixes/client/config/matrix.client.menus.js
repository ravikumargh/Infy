(function () {
  'use strict';

  angular
    .module('matrixes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Matrix',
      state: 'matrix'
    });
  }
}());
