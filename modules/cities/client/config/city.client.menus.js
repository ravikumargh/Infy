(function () {
  'use strict';

  // Configuring the Cities Admin module
  angular
    .module('cities.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Cities',
      state: 'admin.cities.list'
    });
  }
}());
