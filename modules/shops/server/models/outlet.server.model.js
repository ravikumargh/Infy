'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Outlet Schema
 */
var OutletSchema = new Schema({
	// name: {
	// 	type: String,
	// 	default: '',
	// 	trim: true,
	// 	required: 'Name cannot be blank'
	// },
		shop: String,
	address: {
		name: {
			type: String,
			default: '',
			trim: true,
			required: 'Address cannot be blank'
		},
		place: String,
		phone: String,
		components: {
			placeId: String,
			streetNumber: String,
			street: String,
			city: String,
			state: String,
			countryCode: String,
			country: String,
			postCode: String,
			district: String,
			location: {
				lat: String,
				long: String
			}
		}
	},
	landmark: {
		type: String,
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	category: {
		type: Schema.ObjectId,
		ref: 'Category'
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Outlet', OutletSchema);
