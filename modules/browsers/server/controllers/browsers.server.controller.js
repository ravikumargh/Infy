'use strict';
// TODO: integration is pending
/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Browser = mongoose.model('Browser'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create an browser
 */
exports.create = function (req, res) {
  var browser = new Browser(req.body);
  browser.user = req.user;

  browser.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(browser);
    }
  });
};

/**
 * Show the current browser
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var browser = req.browser ? req.browser.toJSON() : {};

  // Add a custom field to the Browser, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Browser model.
  //browser.isCurrentUserOwner = !!(req.user && browser.user && browser.user._id.toString() === req.user._id.toString());

  res.json(browser);
};

/**
 * Update an browser
 * TODO: integration is pending
 */
exports.update = function (req, res) {
  var browser = req.browser;

  browser = _.extend(browser, req.body);

  browser.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(browser);
    }
  });
};

/**
 * Delete an browser
 */
exports.delete = function (req, res) {
  var browser = req.browser;

  browser.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(browser);
    }
  });
};

/**
 * List of Browsers
 */
exports.list = function (req, res) {
  Browser.find().sort('-created').populate('user', 'displayName').exec(function (err, browsers) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(browsers);
    }
  });
};

/**
 * Browser middleware
 */
exports.browserByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Browser is invalid'
    });
  }

  Browser.findById(id).populate('user', 'displayName').exec(function (err, browser) {
    if (err) {
      return next(err);
    } else if (!browser) {
      return res.status(404).send({
        message: 'No browser with that identifier has been found'
      });
    }
    req.browser = browser;
    next();
  });
};
