'use strict';
// TODO: integration is pending
/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Matrix = mongoose.model('Matrix'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create an matrix
 */
exports.create = function (req, res) {
  var matrix = new Matrix(req.body);
  matrix.user = req.user;

  matrix.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(matrix);
    }
  });
};

/**
 * Show the current matrix
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var matrix = req.matrix ? req.matrix.toJSON() : {};

  // Add a custom field to the Matrix, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Matrix model.
  // matrix.isCurrentUserOwner = !!(req.user && matrix.user && matrix.user._id.toString() === req.user._id.toString());

  res.json(matrix);
};

/**
 * Update an matrix
 * TODO: integration is pending
 */
exports.update = function (req, res) {
  var matrix = req.matrix;

  matrix = _.extend(matrix, req.body);

  matrix.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(matrix);
    }
  });
};

/**
 * Delete an matrix
 */
exports.delete = function (req, res) {
  var matrix = req.matrix;

  matrix.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(matrix);
    }
  });
};

/**
 * List of Matrixes
 */
exports.list = function (req, res) {
  Matrix.find().sort('-created').populate('user', 'displayName').exec(function (err, matrixes) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(matrixes);
    }
  });
};

/**
 * Matrix middleware
 */
exports.matrixByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Matrix is invalid'
    });
  }

  Matrix.findById(id).populate('user', 'displayName').exec(function (err, matrix) {
    if (err) {
      return next(err);
    } else if (!matrix) {
      return res.status(404).send({
        message: 'No matrix with that identifier has been found'
      });
    }
    req.matrix = matrix;
    next();
  });
};

/**
 * Matrix middleware
 */
exports.matrixByCategoryID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Matrix is invalid'
    });
  }

  Matrix.findOne({ 'category': id }).populate('category')
	.populate({ path: 'desktopMatrix.os', model: 'OperatingSystem' })
	.populate({ path: 'desktopMatrix.browsers.browser', model: 'Browser' })
	.populate({ path: 'mobileMatrix.os', model: 'OperatingSystem' })
	.populate({ path: 'mobileMatrix.browsers.browser', model: 'Browser' })
	.exec(function (err, matrix) {
    if (err) {
      return next(err);
    } 
    // else if (!matrix) {
    //   return res.status(404).send({
    //     message: 'No matrix with that identifier has been found'
    //   });
    // }
    req.matrix = matrix;
    next();
  });
};
 
