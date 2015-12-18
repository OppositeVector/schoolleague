var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var config = Schema({

	_id: {type: String, required: true},
	data: {}

}, { collection: "config" });

var TAG = "ConfigHandler"
var configModel;

var mongooseCon;

function CheckValidity(innerTAG, type, callback) {

	if(callback == null) {
		console.log(innerTAG + " didnt recieve a callback");
		return true;
	}

	if(configModel == null) {
		callback(innerTAG + TAG + " wasn't initialized");
		return true;
	}

	if(type == null) {
		callback(innerTAG + " didnt recieve a type parameter");
		return true;
	}

	return false;

}

exports.Initialize = function(monCon) {

	mongooseCon = monCon;
	configModel = mongooseCon.model("configM", config);
	console.log(TAG + " initialized");

}

exports.GetAndIncrement = function(type, callback) {

	var innerTAG = TAG + ": GetAndIncrement:";

	if(CheckValidity(innerTAG, type, callback)) {
		return;
	}

	configModel.findOneAndUpdate({ _id: type }, { $inc: { "data.index": 1 } }, { upsert: true }, function(err, config) {

		if(err) {
			callback(err);
			return;
		}

		if(config == null) {
			callback(null, { _id: type, data: { index: 0 } });
		} else {
			callback(null, config);
		}

	});

	// configModel.findOne(type, function(err, config) {

	// 	if(err) {
	// 		callback(err);
	// 		return;
	// 	}

	// 	if(config == null) {

	// 		configModel.create({ _id: type, data: { index: 1 } }, function(err, newConfig) {

	// 			if(err) {
	// 				callback(err);
	// 				return;
	// 			}

	// 			callback(null, 0);

	// 		});

	// 	} else {

	// 		var current = config.data.index;
	// 		config.data.index += 1;
	// 		config.markModified("data.index");
	// 		config.save(function(err) {

	// 			if(err) {
	// 				callback(err);
	// 			} else {
	// 				callback(null, current);
	// 			}

	// 		});

	// 	}

	// }

}

exports.GetConfig = function(mongooseCon, type, callback) {

	if(callback == null) {
		console.log(n + " didnt recieve a callback");
		return;
	}

	if(mongooseCon == null) {
		callback(n + " didnt recieve a mongooseCon parameter");
		return;
	}

	if(type == null) {
		callback(n + " didnt recieve a type parameter");
		return;
	}

	if(configModel == null) {
		configModel = mongooseCon.model("configM", config);
	}

	configModel.findOne(type, function(err, config) {

		if(err) {
			callback(err);
		}

		if(config == null) {

			configModel.create({ _id: type, data: { } }, function(err, newCnfig) {

				if(err) {
					callback(err);
				} else {
					callback(null, newConfig);
				}

			});

		} else {
			callback(null, config);
		}

	});

}