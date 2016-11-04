'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * OperatingSystem Schema
 */
var OperatingSystemSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	},
	version: {
		type: Number,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now
	},
	type: {
		type: String,
		default: 'desktop',
		trim: true
	}
});

mongoose.model('OperatingSystem', OperatingSystemSchema);
