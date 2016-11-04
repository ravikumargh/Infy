(function (app) {
  'use strict';

  app.registerModule('products', ['core']);
  app.registerModule('products.routes', ['ui.router', 'core.routes']);
  app.registerModule('products.services');  
}(ApplicationConfiguration));
