'use strict';

/**
 * Module dependencies
 */
var rolesPolicy = require('../policies/roles.server.policy'),
  roles = require('../controllers/roles.server.controller');

module.exports = function (app) {
  // Roles collection routes
  app.route('/api/roles').all(rolesPolicy.isAllowed)
    .get(roles.list)
    .post(roles.create);

  // Single role routes
  app.route('/api/roles/:roleId').all(rolesPolicy.isAllowed)
    .get(roles.read)
    .put(roles.update)
    .delete(roles.delete);

  // Finish by binding the role middleware
  app.param('roleId', roles.roleByID);
};
