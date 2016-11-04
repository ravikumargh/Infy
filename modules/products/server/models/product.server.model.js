'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	},
	matrix: {
		type: Schema.ObjectId,
		ref: 'Matrix'
	},	
	publishedMatrix: {
		type: Schema.ObjectId,
		ref: 'PublishedMatrix'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Product', ProductSchema);
