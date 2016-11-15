
(function () {
  'use strict';

  // Configuring the Brands Admin module
  angular
    .module('departments.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Departments',
      state: 'admin.departments.list'
    });
  }
}());
