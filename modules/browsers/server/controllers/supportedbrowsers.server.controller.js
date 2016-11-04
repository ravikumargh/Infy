'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  SupportedBrowser = mongoose.model('SupportedBrowser'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current supportedbrowser
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var supportedbrowser = req.supportedbrowser ? req.supportedbrowser.toJSON() : {};

  // Add a custom field to the SupportedBrowser, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the SupportedBrowser model.
//   supportedbrowser.isCurrentUserOwner = !!(req.user && supportedbrowser.user && supportedbrowser.user._id.toString() === req.user._id.toString());

  res.json(supportedbrowser);
};


/**
 * List of Browsers
 */
exports.list = function (req, res) {
  SupportedBrowser.find().sort('-created').populate('user', 'displayName').exec(function (err, supportedbrowsers) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(supportedbrowsers);
    }
  });
};
