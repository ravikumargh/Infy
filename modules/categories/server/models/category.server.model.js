'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Category Schema
 */
var CategorySchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	namedid: {
		type: String
	},
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Display name cannot be blank'
	},
	parents: [],	
	children: [],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Category', CategorySchema);
