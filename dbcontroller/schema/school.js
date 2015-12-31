"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var claims = require("./claims");
var Claim = claims.single;
var findOneOrCreate = require('mongoose-find-one-or-create');

var school = Schema({

	_id: { type: Number, required: true},
	name: String,
	city: String,
	authority: Number,
	fromClass: Number,
	toClass: Number,
	supervision: String,
	origGrading: Number,
	type: String,
	legal: String,
	sector: String,
	address: String,
	fullEducationalDay: Boolean,
	joinedNewHorizons: Boolean,
	foudingYear: Number,
	language: String,
	studentsCount: Number,
	classCount: Number,
	ownership: String,
	position: {
		lon: Number,
		lat: Number
	},
	grades: [ 
		{ 
			year: Number, 
			b: {
				english: Number,
				tech: Number,
				math: Number,
				hebrew: Number,
				arabic: Number
			},
			e: {
				english: Number,
				tech: Number,
				math: Number,
				hebrew: Number,
				arabic: Number
			},
			h: {
				english: Number,
				tech: Number,
				math: Number,
				hebrew: Number,
				arabic: Number
			}
		} 
	],
	claims: [ { year: Number, percent: [ Number ] } ]

}, { collection: "schools" });

school.plugin(findOneOrCreate);

exports.schema = school;

var TranslateClass = exports.TranslateClass = function(str) {

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
		default:
			return -1;

	}

}

exports.GetAtIndex = function(index, school) {

	if(index < 0) {
		return "What?";
	}

	if(index < 22) {

		switch(index) {
		case 0:
			return school.name;
		case 1:
			return school._id;
		case 2:
			return school.supervision;
		case 3:
			return school.fromClass;
		case 4:
			return school.toClass;
		case 5:
			return school.origGrading;
		case 6: 
			return school.authority;
		case 7:
			return school.type;
		case 8:
			return school.legal;
		case 9:
			return school.sector;
		case 10:
			return school.address;
		case 11:
			return school.city;
		case 12:
			return (school.position == null) ? -1 : school.position.lon;
		case 13:
			return (school.position == null) ? -1 : school.position.lat;
		case 14:
			return school.fullEducationalDay;
		case 15:
			return school.joinedNewHorizons;
		case 16:
			return school.foudingYear;
		case 17:
			return school.language;
		case 18: 
			return school.studentsCount;
		case 19:
			return school.ownership;
		case 20:
			return school.classCount;
		case 21:
			return school.studentsCount / school.classCount;

		}

	} else if(index < 97) {
		return GetGrade(index, school);
	} else {
		return GetClaim(index, school);
	}

}

function GetGrade(index, school) {

	if(school.grades == null){
		return -1;
	} else {

		var normalized = index - 22;
		var yearOffset = Math.floor(normalized / 15);
		var year = 2009 + yearOffset;

		var yearIndex = school.grades.findIndex(function(ele) {
			if(ele.year == year) {
				return true;
			} else {
				return false;
			}
		});

		if(yearIndex == -1) {
			return -1;
		} else {

			var classOffset = Math.floor((normalized - (yearOffset * 15)) / 5);
			var classObject;
			if(classOffset == 0) {
				if(school.grades[yearIndex].b == null) {
					return -1;
				} else {
					classObject = school.grades[yearIndex].b;
				}
			} else if(classOffset == 1) {
				if(school.grades[yearIndex].e == null) {
					return -1;
				} else {
					classObject = school.grades[yearIndex].e;
				}
			} else {
				if(school.grades[yearIndex].h == null) {
					return -1;
				} else {
					classObject = school.grades[yearIndex].h;
				}
			}

			var subjectOffset = normalized - (yearOffset * 15) - (classOffset * 5);
			if(subjectOffset == 0) {
				return classObject.english;
			} else if(subjectOffset == 1) {
				return classObject.tech;
			} else if(subjectOffset == 2) {
				return classObject.math;
			} else if(subjectOffset == 3) {
				return classObject.hebrew;
			} else {
				return classObject.arabic;
			}

		}

	}

}

function GetClaim(index, school) {

	if(school.claims == null) {
		return -1;
	} else {

		var normalized = index - 97;
		var year = Math.floor(normalized / 81) + 2009;
		var yearIndex = school.claims.findIndex(function(ele) {
			if(ele.year == year) {
				return true;
			} else {
				return false;
			}
		});

		if(yearIndex > -1) {

			var yearOffset = normalized - ((year - 2009) * 81);
			return school.claims[yearIndex].percent[yearOffset];

		} else {
			return -1;
		}

	}

}

function CheckNaN(val, failed) {
	return (isNaN(val) ? ((failed != null) ? failed : -1) : val);
}

exports.SetAtIndex = function(value, index, school) {

	if(index < 0) {
		return;
	}

	if(index < 22) {

		switch(index) {
		case 0:
			school.name = value;
			break;
		case 1:
			school._id = CheckNaN(parseInt(value));
			break;
		case 2:
			school.supervision = value;
			break;
		case 3:
			school.fromClass = TranslateClass(value);
			break;
		case 4:
			school.toClass = TranslateClass(value);
			break;
		case 5:
			school.origGrading = CheckNaN(parseInt(value));
			break;
		case 6: 
			school.authority = value; // Authority, has to go through the authority model
			break;
		case 7:
			school.type = value;
			break;
		case 8:
			school.legal = value;
			break;
		case 9:
			school.sector = value;
			break;
		case 10:
			school.address = value;
			break;
		case 11:
			school.city = value;
			break;
		case 12:
			if(school.position == null) {
				school.position = { lon: 360, lat: 360 }
			}
			school.position.lon = CheckNaN(parseFloat(value), 360);
			break;
		case 13:
			if(school.position == null) {
				school.position = { lon: 360, lat: 360 }
			}
			school.position.lat = CheckNaN(parseFloat(value), 360);
			break;
		case 14:
			school.fullEducationalDay = (value === "true");
			break;
		case 15:
			school.joinedNewHorizons = (value === "true");
			break;
		case 16:
			school.foudingYear = CheckNaN(parseInt(value));
			break;
		case 17:
			school.language = value;
			break;
		case 18: 
			school.studentsCount = CheckNaN(parseInt(value));
			break;
		case 19:
			school.ownership = value;
			break;
		case 20:
			school.classCount = CheckNaN(parseInt(value));
			break;
		default:
			return;

		}

	} else if(index < 97) {
		SetGrade(value, index, school);
	} else {
		SetClaim(value, index, school);
	}

}

function SetGrade(value, index, school) {

	var val = CheckNaN(parseInt(value));
	if(val == -1) {
		return;
	}

	if(school.grades == null) {
		school.grades = [];
	}

	var normalized = index - 22;
	var yearOffset = Math.floor(normalized / 15);
	var year = 2009 + yearOffset;

	var yearIndex = school.grades.findIndex(function(ele) {
		if(ele.year == year) {
			return true;
		} else {
			return false;
		}
	});

	var yearObject;

	if(yearIndex == -1) {
		yearObject = { year: year };
		school.grades.push(yearObject);
	} else {
		yearObject = school.grades[yearIndex];
	}

	var classOffset = Math.floor((normalized - (yearOffset * 15)) / 5);
	var classObject;
	if(classOffset == 0) {
		if(yearObject.b == null) {
			classObject = { english: -1, tech: -1, math: -1, hebrew: -1, arabic: -1 }
			yearObject.b = classObject;
		} else {
			classObject = yearObject.b;
		}
	} else if(classOffset == 1) {
		if(yearObject.e == null) {
			classObject = { english: -1, tech: -1, math: -1, hebrew: -1, arabic: -1 }
			yearObject.e = classObject;
		} else {
			classObject = yearObject.e;
		}
	} else {
		if(yearObject.h == null) {
			classObject = { english: -1, tech: -1, math: -1, hebrew: -1, arabic: -1 }
			yearObject.h = classObject;
		} else {
			classObject = yearObject.h;
		}
	}

	var subjectOffset = normalized - (yearOffset * 15) - (classOffset * 5);
	if(subjectOffset == 0) {
		classObject.english = val;
	} else if(subjectOffset == 1) {
		classObject.tech = val;
	} else if(subjectOffset == 2) {
		classObject.math = val;
	} else if(subjectOffset == 3) {
		classObject.hebrew = val;
	} else {
		classObject.arabic = val;
	}

}

function SetClaim(value, index, school) {

	var val = CheckNaN(parseFloat(value));
	if(val == -1) {
		return;
	}

	if(school.claims == null) {
		school.claims = [];
	}

	var normalized = index - 97;
	var year = Math.floor(normalized / 81) + 2009;
	var yearIndex = school.claims.findIndex(function(ele) {
		if(ele.year == year) {
			return true;
		} else {
			return false;
		}
	});

	var yearObject;
	if(yearIndex == -1) {

		yearObject = { year: year, percent: [] };
		school.claims.push(yearObject);
		for(var i = 0; i < 81; ++i) {
			yearObject.percent.push(-1);
		}

	} else {
		yearObject = school.claims[yearIndex];
	}

	var yearOffset = normalized - ((year - 2009) * 81);
	yearObject.percent[yearOffset] = val;

}