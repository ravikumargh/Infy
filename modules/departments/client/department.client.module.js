(function (app) {
  'use strict';

  app.registerModule('departments', ['core']);
  app.registerModule('departments.admin', ['core.admin']);
  app.registerModule('departments.admin.routes', ['core.admin.routes']);
  app.registerModule('departments.routes', ['ui.router', 'core.routes']);
  app.registerModule('departments.services');
} (ApplicationConfiguration));
