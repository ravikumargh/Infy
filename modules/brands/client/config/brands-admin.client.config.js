(function () {
  'use strict';

  // Configuring the Brands Admin module
  angular
    .module('brands.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Brands',
      state: 'admin.brands.list'
    });
  }
}());
