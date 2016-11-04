'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * OperatingSystem Schema
 */
var SupportedOperatingSystemSchema = new Schema({
  created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: '',
		trim: true
	}
});

mongoose.model('SupportedOperatingSystem', SupportedOperatingSystemSchema);
