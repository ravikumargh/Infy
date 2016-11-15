(function (app) {
  'use strict';

  app.registerModule('brands', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('brands.admin', ['core.admin']);
  app.registerModule('brands.admin.routes', ['core.admin.routes']);
  app.registerModule('brands.services');
  app.registerModule('brands.routes', ['ui.router', 'core.routes', 'brands.services']);
}(ApplicationConfiguration));
