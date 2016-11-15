(function (app) {
  'use strict';

  app.registerModule('roles', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('roles.admin', ['core.admin']);
  app.registerModule('roles.admin.routes', ['core.admin.routes']);
  app.registerModule('roles.services');
  app.registerModule('roles.routes', ['ui.router', 'core.routes', 'roles.services']);
}(ApplicationConfiguration));
