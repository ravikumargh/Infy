(function () {
  'use strict';

  angular
    .module('operatingsystems')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'OperatingSystems',
      state: 'operatingsystems'
    });
  }
}());
