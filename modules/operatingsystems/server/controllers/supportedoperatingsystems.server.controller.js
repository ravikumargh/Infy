'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  SupportedOperatingSystem = mongoose.model('SupportedOperatingSystem'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current supportedoperatingsystem
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var supportedoperatingsystem = req.supportedoperatingsystem ? req.supportedoperatingsystem.toJSON() : {};

  // Add a custom field to the SupportedOperatingSystem, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the SupportedOperatingSystem model.
  // supportedoperatingsystem.isCurrentUserOwner = !!(req.user && supportedoperatingsystem.user && supportedoperatingsystem.user._id.toString() === req.user._id.toString());

  res.json(supportedoperatingsystem);
};


/**
 * List of OperatingSystems
 */
exports.list = function (req, res) {
  SupportedOperatingSystem.find().sort('-created').populate('user', 'displayName').exec(function (err, supportedoperatingsystems) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(supportedoperatingsystems);
    }
  });
};
