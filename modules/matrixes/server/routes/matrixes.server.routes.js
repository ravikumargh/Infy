'use strict';

/**
 * Module dependencies
 */
var matrixesPolicy = require('../policies/matrixes.server.policy'),
  matrixes = require('../controllers/matrixes.server.controller');

module.exports = function (app) {
  // Matrix collection routes
  app.route('/api/matrixes').all(matrixesPolicy.isAllowed)
    .get(matrixes.list)
    .post(matrixes.create);

  // Single matrix routes
  app.route('/api/matrixes/:matrixId').all(matrixesPolicy.isAllowed)
    .get(matrixes.read)
    .put(matrixes.update)
    .delete(matrixes.delete);

	app.route('/api/matrix/:categoryId')
		.get(matrixes.read)
		.post(matrixes.create)
		.put(matrixes.update)
		.delete(matrixes.delete);

	// Finish by binding the matrix middleware
	app.param('matrixId', matrixes.matrixByID);
	app.param('categoryId', matrixes.matrixByCategoryID);

};
