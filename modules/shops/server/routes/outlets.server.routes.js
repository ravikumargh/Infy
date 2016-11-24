'use strict';

/**
 * Module dependencies
 */
var outletsPolicy = require('../policies/outlets.server.policy'),
  outlets = require('../controllers/outlets.server.controller');

module.exports = function (app) {
  // Outlet collection routes
  app.route('/api/outlets').all(outletsPolicy.isAllowed)
    .get(outlets.list)
    .post(outlets.create);
app.route('/api/shops/:shopId/outlets')
    .get(outlets.shopOuttletList);

  // Single outlet routes
  app.route('/api/outlets/:outletId').all(outletsPolicy.isAllowed)
    .get(outlets.read)
    .put(outlets.update)
    .delete(outlets.delete);

  // Finish by binding the outlet middleware
  app.param('outletId', outlets.outletByID);
  app.param('shopId', outlets.outletByShopID);
};
