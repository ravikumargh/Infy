(function (app) {
  'use strict';

  app.registerModule('matrixes', ['core']);
  app.registerModule('matrixes.category.services', ['core']);
  app.registerModule('matrixes.services', ['core']);
  app.registerModule('matrixes.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
