'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * City Schema
 */
var CitySchema = new Schema({
	placeid: String,
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	},
	district: String,
	state: String,
	country: String,
	countrycode: String,
	postcode: String,
	location: { latitude: String, longitude: String },
	isdefault: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('City', CitySchema);
