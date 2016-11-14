'use strict';

/**
 * Module dependencies
 */
var citiesPolicy = require('../policies/cities.server.policy'),
  cities = require('../controllers/cities.server.controller');

module.exports = function (app) {
  // City collection routes
  app.route('/api/cities').all(citiesPolicy.isAllowed)
    .get(cities.list)
    .post(cities.create);

  // Single city routes
  app.route('/api/cities/:cityId').all(citiesPolicy.isAllowed)
    .get(cities.read)
    .put(cities.update)
    .delete(cities.delete);

  // Finish by binding the city middleware
  app.param('cityId', cities.cityByID);
};
