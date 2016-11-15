'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Role = mongoose.model('Role'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an role
 */
exports.create = function (req, res) {
  var role = new Role(req.body);
  role.user = req.user;

  role.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(role);
    }
  });
};

/**
 * Show the current role
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var role = req.role ? req.role.toJSON() : {};

  // Add a custom field to the Role, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Role model.
  role.isCurrentUserOwner = !!(req.user && role.user && role.user._id.toString() === req.user._id.toString());

  res.json(role);
};

/**
 * Update an role
 */
exports.update = function (req, res) {
  var role = req.role;

  role.title = req.body.title;
  role.content = req.body.content;

  role.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(role);
    }
  });
};

/**
 * Delete an role
 */
exports.delete = function (req, res) {
  var role = req.role;

  role.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(role);
    }
  });
};

/**
 * List of Roles
 */
exports.list = function (req, res) {
  Role.find().sort('-created').populate('user', 'displayName').exec(function (err, roles) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(roles);
    }
  });
};

/**
 * Role middleware
 */
exports.roleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Role is invalid'
    });
  }

  Role.findById(id).populate('user', 'displayName').exec(function (err, role) {
    if (err) {
      return next(err);
    } else if (!role) {
      return res.status(404).send({
        message: 'No role with that identifier has been found'
      });
    }
    req.role = role;
    next();
  });
};
