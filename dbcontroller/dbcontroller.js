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

	commentsModel.findOne({ _id: schoolId }, function(err, data) {

		if(err) {
			callback(innerTAG + err);
			return;
		}
		callback(null, data);

	});

}

exports.PostComment = function(comment, callback) {

	var innerTAG = TAG + ": PostComment: ";
	if(callback == null) {
		console.log(innerTAG + "no callback supplied");
		return;
	}

	commentsModel.findOne({ _id: comment.school }, function(err, commentsData) {

		if(err) {
			callback(err);
			return;
		}

		var formedComment = {
			poster: comment.poster,
			time: Date.now(),
			content: comment.content
		}

		if(commentsData == null) {
			commentsData = { 
				_id: comment.school, 
				replies: [ formedComment ] 
			}
		} else {

			if(comment.path == null) {
				commentsData.replies.push(formedComment);
			} else {

				var split = comment.path.split(" ");
				var current = commentsData;
				var parsed;
				for(var i = 0; i < split.length; ++i) {
					parsed = parseInt(split[i]);
					if(!isNaN(parsed)) {
						current = current.replies[parsed];
					}
				}
				if(current.replies == null) {
					current.replies = [];
				}
				current.replies.push(formedComment);
			}
			
		}

		commentsModel.update({ _id: commentsData._id }, commentsData, { upsert: true }, function(err, data) {

			if(err) {
				callback(err);
				return;
			}
			callback(null, commentsData);

		})

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
			callback("1: " + err);
			return;
		}

		if(data == null) { // Data wasn't found

			// Get a new authority index number
			config.GetAndIncrement("authority", function(err, config) {

				if(err) {
					callback("2: " + err);
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
						callback("3: " + err);
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
				// console.log(school);
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
						console.log(data);
						callback("4: " + err);
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
		position: {
			lon: parseFloat(data[12]),
			lat: parseFloat(data[13])
		},
		fullEducationalDay: (data[14] === "true"),
		joinedNewHorizons: (data[15] === "true"),
		foudingYear: parseInt(data[16]),
		language: data[17],
		studentsCount: parseInt(data[18]),
		ownership: data[19],
		classCount: parseInt(data[20])

	}

	if(isNaN(school.position.lon)) {
		school.position.lon = 360;
	}

	if(isNaN(school.position.lat)) {
		school.position.lat = 360;
	}
	if(isNaN(school.origGrading)) {
		school.origGrading = -1;
	}
	if(isNaN(school.studentsCount)) {
		school.studentsCount = -1;
	}

	var authority = I_GetAuthority(school, function(err, authority) {

		if(err) {
			school.status = err;
			callback(1, school);
			return;
		}

		school.authority = authority._id;

		// console.log(school);

		schoolModel.findOneOrCreate({ _id: school._id }, school, function(err, s) {

			if(err) {
				school.status = err;
				callback(2, school);
				return;
			}

			var posErr = false;
			if(s.position.lon == 0) {
				s.position.lon = 360;
				posErr = true;
			}
			if(s.position.lat == 0) {
				s.position.lat = 360;
				posErr = true;
			}

			if(posErr == true) {

				s.save(function(err) {
					if(err) {
						school.status = err;
						callback(4, school);
						return;
					}
					school.status = "Position non-exsistant, was 0, corrected to 360";
					callback(3, school);
				});
				
			} else {
				school.status = "Found or created";
				callback(null, school);
			}

		});

	});

}

exports.RecieveGrades = function(data, callback) {

	// in-year in-class indexing:
	// 0 - engligh
	// 1 - tech
	// 2 - math
	// 3 - hebrew
	// 4 - arabic

	// in-year classes:
	// 0 - 4: b
	// 5 - 9: e
	// 10 - 14 : h

	// yearly indicies
	// 22 - 36: 2009
	// 37 - 51: 2010
	// 52 - 66: 2011
	// 67 - 81: 2012
	// 82 - 96: 2013

	var school = {
		_id: parseInt(data[1]),
		grades: {
			year: 2009,
			class: Number,
			math: Number,
			tech: Number,
			hebrew: Number,
			english: Number,
			arabic: Number
		}
	}

}

exports.RecieveClaimsNOT = function(data, callback) {

	var current = 0;
	var bulk = 100;
	var errs = false;

	var Recursive = function(current, bulk, recData) {

		var top = ((current + bulk) > recData.length) ? recData.length : (current + bulk);
		var ids = [];
		var currentBlock = [];
		var blockIndex = 0;
		for(; current < top; ++current) {

			var id = parseInt(recData[current][1]);
			if(!isNaN(id)) {

				currentBlock.push({ id: id, claims: [] });
				ids.push(id);
				var claims = { year: 2009, percent: [] };
				var tmp = 0;
				for(var i = 97; i < 178; ++i) {
					tmp = parseFloat(recData[current][i]);
					current.percent.push((isNaN(tmp)) ? -1 : tmp);
				}
				currentBlock[blockIndex].claims.push(claims);
				claims = { year: 2010, percent: [] };
				for(var i = 178; i < 259; ++i) {
					tmp = parseFloat(recData[current][i]);
					claims.percent.push((isNaN(tmp)) ? -1 : tmp);
				}
				currentBlock[blockIndex].claims.push(claims);
				claims = { year: 2011, percent: [] };
				for(var i = 259; i < 340; ++i) {
					tmp = parseFloat(recData[current][i]);
					claims.percent.push((isNaN(tmp)) ? -1 : tmp);
				}
				currentBlock[blockIndex].claims.push(claims);
				current = { year: 2012, percent: [] };
				for(var i = 340; i < 421; ++i) {
					tmp = parseFloat(recData[current][i]);
					current.percent.push((isNaN(tmp)) ? -1 : tmp);
				}
				currentBlock[blockIndex].claims.push(current);
				claims = { year: 2013, percent: [] };
				for(var i = 421; i < 502; ++i) {
					tmp = parseFloat(recData[current][i]);
					claims.percent.push((isNaN(tmp)) ? -1 : tmp);
				}
				currentBlock[blockIndex].claims.push(claims);
				++blockIndex;

			}
			
		}

		//returned = 0;

		schoolModel.find({ _id: { $in: ids } }, function(err, schools) {

			var tmp = 0;
			for(var i = 0; i < currentBlock.length; ++i) {

				tmp = schools.findIndex(function(ele) {
					if(ele._id == currentBlock[i].id) {
						return true;
					} else {
						return false;
					}
				});

				if(tmp > -1) {
					
					schools[tmp].claims = currentBlock[i].claims;
					schools[tmp].save(function(err, school) {
						if(err) {
							console.log(err);
							console.log(school);
							errs = true;
						}
					});

				} else {
					console.log("Could not find school " + currentBlock[i].id + " in database");
					errs = true;
				}

			}

			if(current < recData.length) {
				Recursive(current, bulk, recData);
			} else {
				console.log("Finished inserting all data" + ((errs == true) ? " with some errors" : ""));
			}
			

		});

	}

	Recursive(current, bulk, data);

	// schoolModel.findOne({ _id: parseInt(data[1]) }, function(err, school) {

	// 	if(err) {
	// 		callback(err);
	// 		return;
	// 	}

	// 	var claims = [];
	// 	var current = { year: 2009, percent: [] };
	// 	for(var i = 97; i < 178; ++i) {
	// 		var f = parseFloat(data[i]);
	// 		current.percent.push((isNaN(f)) ? -1 : f);
	// 	}
	// 	claims.push(current);
	// 	current = { year: 2010, percent: [] };
	// 	for(var i = 178; i < 259; ++i) {
	// 		var f = parseFloat(data[i]);
	// 		current.percent.push((isNaN(f)) ? -1 : f);
	// 	}
	// 	claims.push(current);
	// 	current = { year: 2011, percent: [] };
	// 	for(var i = 259; i < 340; ++i) {
	// 		var f = parseFloat(data[i]);
	// 		current.percent.push((isNaN(f)) ? -1 : f);
	// 	}
	// 	claims.push(current);
	// 	current = { year: 2012, percent: [] };
	// 	for(var i = 340; i < 421; ++i) {
	// 		var f = parseFloat(data[i]);
	// 		current.percent.push((isNaN(f)) ? -1 : f);
	// 	}
	// 	claims.push(current);
	// 	current = { year: 2013, percent: [] };
	// 	for(var i = 421; i < 502; ++i) {
	// 		var f = parseFloat(data[i]);
	// 		current.percent.push((isNaN(f)) ? -1 : f);
	// 	}
	// 	claims.push(current);

	// 	school.claims = claims;
	// 	school.save(function(err) {
	// 		if(err) {
	// 			callback(err);
	// 		} else {
	// 			callback(null, school);
	// 		}
	// 	});

	// });

}

exports.RecieveData = function(data, callback) {

	var i = 0;
	var end = 2600;

	var Recursive = function() {

		var Continue = function() {

			++i;
			if((i < data.length) && (i < end)) {
				Recursive();
			} else {
				if(callback != null) {
					callback(null,  "Finished");
				}
			}

		}

		var newSchool = {}
		for(var j = 0; j < data[i].length; ++j) {
			school.SetAtIndex(data[i][j], j, newSchool);
		}

		I_GetAuthority(newSchool, function(err, authority) {

			if(err) {

				console.log("Failed authority retrieval on " + i);
				console.log(err);
				console.log(newSchool);
				Continue();
				return;

			}

			newSchool.authority = authority._id;
			var id = newSchool._id;
			delete newSchool._id;

			schoolModel.update({ _id: id }, newSchool, { upsert: true }, function(err, returnedSchool) {

				if(err) {
					console.log("Failed on " + i);
					console.log(err);
					console.log(newSchool);
				} else {
					console.log("Success on " + i);
				}

				Continue();

			});

		});

	}

	Recursive();

}