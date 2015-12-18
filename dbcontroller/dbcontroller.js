"use strict";

// Exported Functions:
// GetSchool(schoolId, callback)
// GetAllSchools(callback)
// GetCityByName(cityName, callback)
// GetCityById(cityId, callback)
// GetComments(schoolId, callback)

var mongoose = require("mongoose");

var config = require("./configHandler");
//mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connect('mongodb://natalie:tuti1007@ds055772.mongolab.com:55772/heroku_tc5r8rrm');
var con = exports.connection = mongoose.connection;

var school = require("./schema/school");
var schoolModel = mongoose.model("schoolM", school.schema);
var comments = require("./schema/commentboard");
var commentsModel = mongoose.model("commentsM", comments.schema);
var city = require("./schema/city");
var cityModel = mongoose.model("cityM", city.schema);
var authority = require("./schema/authority");
var authorityModel = mongoose.model("authorityM", authority.schema);

var TAG = "DBController";

con.once('open',function(err){

	if(err){
		console.log(err);
	}else{
		config.Initialize(mongoose);
		console.log('Successfully opened production db connection');
	}

});

exports.TestConfig = function(type, callback) {

	config.GetAndIncrement(type, function(err, data) {

		if(err) {
			callback(err);
			return;
		}

		callback(null, data);

	});

}


exports.GetSchool = function(schoolId, callback) {

	var innerTAG = TAG + ": GetSchool: ";
	if(callback == null) {
		console.log(innerTAG + "no callback supplied");
		return;
	}

	schoolModel.findOne({ _id: schoolId }, function(err, data) {

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

exports.GetBasicSchoolsInfo = function(callback) {

	var innerTAG = TAG + ": GetBasicSchoolsInfo: ";
	if(callback == null) {
		console.log(innerTAG + "no callback supplied");
		return;
	}

	schoolModel.find({}, "_id name city authority", function(err, schools) {

		if(err) {
			callback(err);
			return;
		}

		callback(null,  schools);

	});

}

exports.GetCityByName = function(cityName, callback) {

	var innerTAG = TAG + ": GetCityByName: ";
	if(callback == null) {
		console.log(innerTAG + "no callback supplied");
		return;
	}

	authorityModel.findOne({ cities: cityName }, function(err, authorityData) {

		if(err) {
			callback(err);
			return;
		}

		if(authorityData == null) {
			callback(innerTAG + " could not find the city");
			return;
		}

		console.log(authorityData);

		schoolModel.find({ _id: { $in: authorityData.schools } }, function(err, schools) {

			if(err) {
				callback(err);
				return;
			}

			callback(null, schools);

		});

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

function TranslateClass(str) {

	switch(str) {

		case "א":
			return 1;
		case "ב":
			return 2;
		case "ג":
			return 3;
		case "ד":
			return 4;
		case "ה":
			return 5;
		case "ו":
			return 6;
		case "ז":
			return 7;
		case "ח":
			return 8;
		case "ט":
			return 9;
		case "י":
			return 10;
		case "יא":
			return 11;
		case "יב":
			return 12;
		case "יג":
			return 13;
		case "יד":
			return 14;

	}

}

function I_GetAuthority(school, callback) {

	// Try to find the school's authority in the DB
	authorityModel.findOne({ name: school.authority }, function(err, data) {

		if(err) {
			callback(err);
			return;
		}

		if(data == null) { // Data wasn't found

			// Get a new authority index number
			config.GetAndIncrement("authority", function(err, config) {

				if(err) {
					callback(err);
					return;
				}

				var createData = {
					_id: config.data.index, 
					name: school.authority, 
					cities: [ school.city ], 
					schools:[ school._id ] 
				}

				// Create a new authority object in the DB
				authorityModel.create(createData, function(err, authority) {

					if(err) {
						callback(err);
						return;
					}

					callback(null, authority);

				});

			});

		} else { // Data wast found

			var update = false;

			// Update authority's school data if necessary
			if(data.schools.indexOf(school._id) == -1) {
				update = true;
				data.schools.push(school._id);
			}

			// Update authority's city data if necessary
			if(data.cities.indexOf(school.city) == -1) {
				update = true;
				data.cities.push(school.city);
			}

			if(update == true) { // New data was found

				data.save(function(err) {

					if(err) {
						callback(err);
					} else {
						callback(null, data);
					}

				});

			} else {
				callback(null, data);
			}
			
		}
		
	});

}

exports.RecieveSchool = function(data, callback) {

	var pos = {
		lon: parseFloat(data[12]),
		lat: parseFloat(data[13])
	}

	if(isNaN(pos.lon)) {
		pos.lon = 0;
	}

	if(isNaN(pos.lat)) {
		pos.lat = 0;
	}

	var school = {

		name: data[0],
		_id: parseInt(data[1]),
		supervision: data[2],
		fromClass: TranslateClass(data[3]),
		toClass: TranslateClass(data[4]),
		origGrading: parseInt(data[5]),
		authority: data[6],
		type: data[7],
		legal: data[8],
		sector: data[9],
		address: data[10],
		city: data[11],
		position: pos,
		fullEducationalDay: (data[14] === "true"),
		joinedNewHorizons: (data[15] === "true"),
		foudingYear: parseInt(data[16]),
		language: data[17],
		studentsCount: parseInt(data[18]),
		ownership: data[19],
		classCount: parseInt(data[20])

	}

	var authority = I_GetAuthority(school, function(err, authority) {

		if(err) {
			callback(err);
			return;
		}

		school.authority = authority._id;

		console.log(school);

		schoolModel.findOneOrCreate({ _id: school._id }, school, function(err, s) {

			if(err) {
				callback(err);
				return;
			}

			callback(null, s);

		});

	});

}