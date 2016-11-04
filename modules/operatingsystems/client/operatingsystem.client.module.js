(function (app) {
  'use strict';

  app.registerModule('operatingsystems', ['core']);
  app.registerModule('operatingsystems.routes', ['ui.router', 'core.routes']);
  app.registerModule('operatingsystems.services');
  app.registerModule('supportedoperatingsystems.services');
}(ApplicationConfiguration));
