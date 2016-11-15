(function (app) {
  'use strict';

  app.registerModule('cities', ['core']);
  app.registerModule('cities.admin', ['core.admin']);
  app.registerModule('cities.admin.routes', ['core.admin.routes']);
  app.registerModule('cities.routes', ['ui.router', 'core.routes']);
  app.registerModule('cities.services');  
}(ApplicationConfiguration));
