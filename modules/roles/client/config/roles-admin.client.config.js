(function () {
  'use strict';

  // Configuring the Roles Admin module
  angular
    .module('roles.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Roles',
      state: 'admin.roles.list'
    });
  }
}());
