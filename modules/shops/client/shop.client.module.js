(function (app) {
  'use strict';

  app.registerModule('shops', ['core']);
  app.registerModule('shops.admin', ['core.admin']);
  app.registerModule('shops.admin.routes', ['core.admin.routes']);
  app.registerModule('shops.routes', ['ui.router', 'core.routes']);
  app.registerModule('shops.services');
} (ApplicationConfiguration));
