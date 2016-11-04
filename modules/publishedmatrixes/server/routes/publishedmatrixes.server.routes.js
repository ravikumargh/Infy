'use strict';

/**
 * Module dependencies
 */
var publishedmatrixesPolicy = require('../policies/publishedmatrixes.server.policy'),
  publishedmatrixes = require('../controllers/publishedmatrixes.server.controller');

module.exports = function (app) {

	app.route('/api/publishedmatrix/:categoryId').all(publishedmatrixesPolicy.isAllowed)
		.get(publishedmatrixes.read)
		.post(publishedmatrixes.publish)
		.put(publishedmatrixes.publish);

	app.route('/api/publishedmatrix/category/:categoryName').all(publishedmatrixesPolicy.isAllowed)
		.get(publishedmatrixes.read);
		
	// Finish by binding the matrix middleware
	app.param('categoryId', publishedmatrixes.publishedmatrixByCategoryID);
	app.param('categoryName', publishedmatrixes.publishedmatrixByCategoryName);

};
