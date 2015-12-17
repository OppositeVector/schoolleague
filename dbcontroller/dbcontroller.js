"use strict";

// Exported Functions:
// GetSchool(schoolId, callback)
// GetAllSchools(callback)
// GetCityByName(cityName, callback)
// GetCityById(cityId, callback)
// GetComments(schoolId, callback)

var mongoose = require("mongoose");

mongoose.connect(process.env.MONGOLAB_URI);
var con = exports.connection = mongoose.connection;

var school = require("./schema/school");
var schoolModel = mongoose.model("schoolM", school.schema);
var comments = require("./schema/commentboard");
var commentsModel = mongoose.model("commentsM", comments.schema);
var city = require("./schema/city");
var cityModel = mongoose.model("cityM", city.schema);

var TAG = "DBController";

con.once('open',function(err){

	if(err){
		console.log(err);
	}else{
		console.log('Successfully opened production db connection');
	}

});

exports.GetSchool = function(schoolId, callback) {

	var innerTAG = TAG + ": GetSchool: ";
	if(callback == null) {
		console.log(innerTAG + "no callback supplied");
		return;
	}

	schoolModel.findOne({ id: schoolId }, function(err, data) {

		if(err != null) {
			callback(err);
			return;
		}

		if(data != null) {
			callback(null, data);
		} else {
			callback(innerTAG + "Could not find school");
		}

	});

}

exports.GetAllSchools = function(callback) {

	var innerTAG = TAG + ": GetAllSchools: ";
	if(callback == null) {
		console.log(innerTAG + "no callback supplied");
		return;
	}

	schoolModel.find({}, 'id name position', function(err, data) {

		if(err) {
			callback(innerTAG + err);
			return;
		}

		callback(null, data);

	});

}

exports.GetCityByName = function(cityName, callback) {

	var innerTAG = TAG + ": GetCityByName: ";
	if(callback == null) {
		console.log(innerTAG + "no callback supplied");
		return;
	}

	cityModel.findOne({ name: cityName }, function(err, data) {

		if(err) {
			callback(innerTAG + err);
			return;
		}

		callback(data);

	});

}

exports.GetCityById = function(cityId, callback) {

	var innerTAG = TAG + ": GetCityById: ";
	if(callback == null) {
		console.log(innerTAG + "no callback supplied");
		return;
	}

	cityModel.findOne({ id: cityId }, function(err, data) {

		if(err) {
			callback(innerTAG + err);
			return;
		}

		callback(data);

	});

}

exports.GetComments = function(schoolId, callback) {

	var innerTAG = TAG + ": GetComments: ";
	if(callback == null) {
		console.log(innerTAG + "no callback supplied");
		return;
	}

	commentsModel.findOne({ schoolId: schoolId }, function(err, data) {

		if(err) {
			callback(innerTAG + err);
			return;
		}

		callback(null, data);

	});

}