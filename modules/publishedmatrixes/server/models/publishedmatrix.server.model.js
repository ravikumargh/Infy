'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Matrix Schema
 */
var PublishedMatrixSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	desktopMatrix: {
		type: [] 
	},
	mobileMatrix: {
		type: [] 
	},
	category: {
		type: Schema.ObjectId,
		ref: 'Category'
	}
});

mongoose.model('PublishedMatrix', PublishedMatrixSchema);
