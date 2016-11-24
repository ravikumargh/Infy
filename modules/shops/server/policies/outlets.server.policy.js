'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Outlets Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/outlets',
      permissions: '*'
    }, {
      resources: '/api/outlets/:outletId',
      permissions: '*'
    },{
      resources: '/api/shops/:shopId/outlets/:outletId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/outlets',
      permissions: ['get']
    }, {
      resources: '/api/outlets/:outletId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/outlets',
      permissions: ['get']
    }, {
      resources: '/api/outlets/:outletId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Outlets Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an outlet is being processed and the current user created it then allow any manipulation
  if (req.outlet && req.user && req.outlet.user && req.outlet.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
