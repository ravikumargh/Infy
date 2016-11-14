(function (app) {
  'use strict';

  app.registerModule('departments', ['core']);
  app.registerModule('departments.routes', ['ui.router', 'core.routes']);
  app.registerModule('departments.services');  
}(ApplicationConfiguration));
