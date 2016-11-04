'use strict';

/**
 * Module dependencies
 */
var browsersPolicy = require('../policies/browsers.server.policy'),
  browsers = require('../controllers/browsers.server.controller'),
  supportedbrowsers = require('../controllers/supportedbrowsers.server.controller');

module.exports = function (app) {
  // Browser collection routes
  app.route('/api/browsers').all(browsersPolicy.isAllowed)
    .get(browsers.list)
    .post(browsers.create);

  // Single browser routes
  app.route('/api/browsers/:browserId').all(browsersPolicy.isAllowed)
    .get(browsers.read)
    .put(browsers.update)
    .delete(browsers.delete);

app.route('/api/supportedbrowsers')
		.get(supportedbrowsers.list);	

  // Finish by binding the browser middleware
  app.param('browserId', browsers.browserByID);
};
