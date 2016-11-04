'use strict';
// TODO: integration is pending
/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  OperatingSystem = mongoose.model('OperatingSystem'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create an operatingsystem
 */
exports.create = function (req, res) {
  var operatingsystem = new OperatingSystem(req.body);
  operatingsystem.user = req.user;

  operatingsystem.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(operatingsystem);
    }
  });
};

/**
 * Show the current operatingsystem
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var operatingsystem = req.operatingsystem ? req.operatingsystem.toJSON() : {};

  // Add a custom field to the OperatingSystem, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the OperatingSystem model.
  // operatingsystem.isCurrentUserOwner = !!(req.user && operatingsystem.user && operatingsystem.user._id.toString() === req.user._id.toString());

  res.json(operatingsystem);
};

/**
 * Update an operatingsystem
 * TODO: integration is pending
 */
exports.update = function (req, res) {
  var operatingsystem = req.operatingsystem;

  operatingsystem = _.extend(operatingsystem, req.body);

  operatingsystem.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(operatingsystem);
    }
  });
};

/**
 * Delete an operatingsystem
 */
exports.delete = function (req, res) {
  var operatingsystem = req.operatingsystem;

  operatingsystem.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(operatingsystem);
    }
  });
};

/**
 * List of OperatingSystems
 */
exports.list = function (req, res) {
  OperatingSystem.find().sort('-created').populate('user', 'displayName').exec(function (err, operatingsystems) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(operatingsystems);
    }
  });
};

/**
 * OperatingSystem middleware
 */
exports.operatingsystemByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'OperatingSystem is invalid'
    });
  }

  OperatingSystem.findById(id).populate('user', 'displayName').exec(function (err, operatingsystem) {
    if (err) {
      return next(err);
    } else if (!operatingsystem) {
      return res.status(404).send({
        message: 'No operatingsystem with that identifier has been found'
      });
    }
    req.operatingsystem = operatingsystem;
    next();
  });
};
