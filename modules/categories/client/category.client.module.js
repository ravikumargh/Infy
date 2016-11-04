(function (app) {
  'use strict';

  app.registerModule('categories', ['core']);
  app.registerModule('categories.routes', ['ui.router', 'core.routes']);
  app.registerModule('categories.services');  
}(ApplicationConfiguration));
