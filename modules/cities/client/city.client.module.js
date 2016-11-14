(function (app) {
  'use strict';

  app.registerModule('cities', ['core']);
  app.registerModule('cities.routes', ['ui.router', 'core.routes']);
  app.registerModule('cities.services');  
}(ApplicationConfiguration));
