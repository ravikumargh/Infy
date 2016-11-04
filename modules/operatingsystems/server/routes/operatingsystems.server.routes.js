'use strict';

/**
 * Module dependencies
 */
var operatingsystemsPolicy = require('../policies/operatingsystems.server.policy'),
  operatingsystems = require('../controllers/operatingsystems.server.controller'),
  supportedoperatingsystems = require('../controllers/supportedoperatingsystems.server.controller');

module.exports = function (app) {
  // operatingsystem collection routes
  app.route('/api/operatingsystems').all(operatingsystemsPolicy.isAllowed)
    .get(operatingsystems.list)
    .post(operatingsystems.create);

  // Single operatingsystem routes
  app.route('/api/operatingsystems/:operatingsystemId').all(operatingsystemsPolicy.isAllowed)
    .get(operatingsystems.read)
    .put(operatingsystems.update)
    .delete(operatingsystems.delete);

app.route('/api/supportedoperatingsystems')
		.get(supportedoperatingsystems.list);	

  // Finish by binding the operatingsystem middleware
  app.param('operatingsystemId', operatingsystems.operatingsystemByID);
};
