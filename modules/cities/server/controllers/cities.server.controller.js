'use strict';
// TODO: integration is pending
/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  City = mongoose.model('City'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create an city
 */
exports.create = function (req, res) {
  var city = new City(req.body);
  city.user = req.user;

  city.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(city);
    }
  });
};

/**
 * Show the current city
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var city = req.city ? req.city.toJSON() : {};

  // Add a custom field to the City, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the City model.
  // city.isCurrentUserOwner = !!(req.user && city.user && city.user._id.toString() === req.user._id.toString());

  res.json(city);
};

/**
 * Update an city
 * TODO: integration is pending
 */
exports.update = function (req, res) {
  var city = req.city;

  city = _.extend(city, req.body);

  city.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(city);
    }
  });
};

/**
 * Delete an city
 */
exports.delete = function (req, res) {
  var city = req.city;

  city.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(city);
    }
  });
};

/**
 * List of cities
 */
exports.list = function (req, res) {
  City.find().sort('-created')
                .populate('user', 'displayName').populate('matrix', 'created')
                .populate('publishedMatrix', 'created')
                .exec(function (err, cities) {
                  if (err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err)
                    });
                  } else {
                    res.json(cities);
                  }
                });
};

/**
 * City middleware
 */
exports.cityByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'City is invalid'
    });
  }

  City.findById(id).populate('user', 'displayName').exec(function (err, city) {
    if (err) {
      return next(err);
    } else if (!city) {
      return res.status(404).send({
        message: 'No city with that identifier has been found'
      });
    }
    req.city = city;
    next();
  });
};
