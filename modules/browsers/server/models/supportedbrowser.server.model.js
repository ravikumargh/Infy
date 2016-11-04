'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Browser Schema
 */
var SupportedBrowserSchema = new Schema({
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

mongoose.model('SupportedBrowser', SupportedBrowserSchema);
