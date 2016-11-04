'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Matrix Schema
 */
var MatrixSchema = new Schema({
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
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Matrix', MatrixSchema);
