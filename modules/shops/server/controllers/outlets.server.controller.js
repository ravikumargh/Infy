'use strict';
// TODO: integration is pending
/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Outlet = mongoose.model('Outlet'),
  Shop = mongoose.model('Shop'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create an outlet
 */
exports.create = function (req, res) {
  var outlet = new Outlet(req.body);
  outlet.user = req.user;
  outlet._doc.shop = req.body.shop;

  outlet.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(outlet);
    }
  });
};

/**
 * Show the current outlet
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var outlet = req.outlet ? req.outlet.toJSON() : {};

  // Add a custom field to the Outlet, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Outlet model.
  // outlet.isCurrentUserOwner = !!(req.user && outlet.user && outlet.user._id.toString() === req.user._id.toString());

  res.json(outlet);
};

/**
 * Update an outlet
 * TODO: integration is pending
 */
exports.update = function (req, res) {
  var outlet = req.outlet;

  outlet = _.extend(outlet, req.body);

  outlet.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(outlet);
    }
  });
};

/**
 * Delete an outlet
 */
exports.delete = function (req, res) {
  var outlet = req.outlet;

  outlet.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(outlet);
    }
  });
};

/**
 * List of Outlets
 */
exports.list = function (req, res) {
  Outlet.find().sort('-created')
    .populate('user', 'displayName').populate('matrix', 'created')
    .populate('publishedMatrix', 'created')
    .exec(function (err, outlets) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(outlets);
      }
    });
};
/**
 * List of Outlets
 */
exports.shopOuttletList = function (req, res) {
  Outlet.find({'shop': req.params.shopId }).exec(function (err, outlets) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(outlets);
      }
    });
};
/**
 * Outlet middleware
 */
exports.outletByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Outlet is invalid'
    });
  }

  Outlet.findById(id).populate('user', 'displayName').exec(function (err, outlet) {
    if (err) {
      return next(err);
    } else if (!outlet) {
      return res.status(404).send({
        message: 'No outlet with that identifier has been found'
      });
    }
    req.outlet = outlet;
    next();
  });
};
/**
 * Outlet middleware
 */

exports.outletByShopID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Shop is invalid'
    });
  }

  Shop.findById(id).populate('user', 'displayName').exec(function (err, shop) {
    if (err) {
      return next(err);
    } else if (!shop) {
      return res.status(404).send({
        message: 'No Shop with that identifier has been found'
      });
    }
    req.outlet = shop;
    next();
  });
};
