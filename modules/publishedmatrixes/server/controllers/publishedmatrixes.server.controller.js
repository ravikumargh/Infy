'use strict';
// TODO: integration is pending
/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  PublishedMatrix = mongoose.model('PublishedMatrix'),
	Category = mongoose.model('Category'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var getDeviceMatrix = function (deviceMatrixFromFile, deviceMatrix) {
	_.forEach(deviceMatrixFromFile, function (item) {
		var matrix = {};
		matrix.name = item.name;
		matrix.version = item.version;
		matrix.browsers = [];
		_.forEach(item.browsers, function (b) {
			var browser = {};
			browser.name = b.name;
			browser.version = b.version;
			browser.isBaseVersion = b.isBaseVersion;
			browser.isSupported = b.isSupported;
			matrix.browsers.push(browser);
		});
		deviceMatrix.push(matrix);
	});
};

// Upload matrix JSON file to Akamia using ssh. 
var pushToAkamai = function (publishedMatrix, category) {
	var SSH2Utils = require('ssh2-utils');
	var ssh = new SSH2Utils();
	var fs = require('fs');
	var server = {
		host: 'pearsondnld.upload.akamai.com',
		username: 'sshacs',
		port: 22,
		privateKey: require('fs').readFileSync('netstorage_key_osbrowsercheck_root_Original')
	};
	var path = 'temp/' + category.name + '.json';
	var akamaiPath = 'dev/data/' + category.name + '.json';

	var publishedMatrixJSON = publishedMatrix.toJSON();
	var matrixJson = {};
	matrixJson.category = {};
	matrixJson.mobileMatrix = {};
	matrixJson.desktopMatrix = {};

	matrixJson._id = publishedMatrixJSON._id;
	matrixJson.publishedOn = publishedMatrixJSON.created;
	matrixJson.category._id = category._id;
	matrixJson.category.name = category.name;
	matrixJson.category.owner = category.user;

	matrixJson.mobileMatrix = [];
	matrixJson.desktopMatrix = [];

	getDeviceMatrix(publishedMatrixJSON.mobileMatrix, matrixJson.mobileMatrix);
	getDeviceMatrix(publishedMatrixJSON.desktopMatrix, matrixJson.desktopMatrix);

	//Write JSON data to local folder.
	fs.writeFile(path, JSON.stringify(matrixJson), function (err) {
		if (err) {
			return console.log(err);
		}
		//console.log("Local: The file saved at: "+path);
		//Upload json file to akamai.
		ssh.putFile(server, path, akamaiPath, function (err) {
			if (err) console.log(err);
			//console.log("Akamai: The file pushed to: "+akamaiPath);
			fs.exists(path, function (exists) {
				if (exists) {
					fs.unlink(path);
					//console.log("unlinked "+path);
					return;
				}
			});
		});
	});
};



/**
 * publish a matrix
 */
exports.publish = function(req, res) {
		var publishedMatrix;
	if(req.publishedMatrix){
		 publishedMatrix = req.publishedMatrix;
		 publishedMatrix = _.extend(publishedMatrix, req.body);
	}else{
		 publishedMatrix = new PublishedMatrix(req.body);
	}
		publishedMatrix.user = req.user;
		publishedMatrix.created = Date.now();

		publishedMatrix.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.json(publishedMatrix);

				Category.findById(publishedMatrix.category).exec(function(err, category) {
					if (!err) {
						pushToAkamai(publishedMatrix, category);						
					}
				});


			}
		});
};

/**
 * Show the current publishedMatrix
 */
exports.read = function(req, res) {
	res.json(req.publishedMatrix);
};
 
/**
 * PublishedMatrix middleware
 */
exports.publishedmatrixByCategoryID = function(req, res, next, id) {
	PublishedMatrix.findOne({ 'category': id }).populate('category')
	.exec(function(err, publishedMatrix) {
		if (err) return next(err);
		//if (!publishedMatrix) return next(new Error('Failed to load publishedMatrix ' + id));
		req.publishedMatrix = publishedMatrix;
		next();
	});
};
/**
 * PublishedMatrix middleware
 */
exports.publishedmatrixByCategoryName = function (req, res, next, name) {
	res.header('Access-Control-Allow-Origin', '*');
  	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
   
	Category.findOne({ 'name': name }).exec(function (err, category) {
		if (category) {
			PublishedMatrix.findOne({ 'category': category.id }).populate('category')
				.exec(function (err, publishedMatrix) {
					if (err) return next(err);
					//if (!publishedMatrix) return next(new Error('Failed to load publishedMatrix ' + id));
					req.publishedMatrix = publishedMatrix;
					next();
				});
		}else{
			next();
		}
	}, function (err, matrix) {
		if (err) return next(err);
	});
};