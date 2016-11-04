(function (app) {
  'use strict';

  app.registerModule('browsers', ['core']);
  app.registerModule('browsers.routes', ['ui.router', 'core.routes']);
  app.registerModule('browsers.services');
  app.registerModule('supportedbrowsers.services');
}(ApplicationConfiguration));
