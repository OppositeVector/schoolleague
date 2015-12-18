"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var claims = require("./claims");
var Claim = claims.single;
var findOneOrCreate = require('mongoose-find-one-or-create');

var Position = Schema({
	lon: Number,
	lat: Number
})

var Grade = Schema({
	class: Number,
	year: Number,
	math: Number,
	tech: Number,
	hebrew: Number,
	english: Number,
	arabic: Number
});


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
	grades: [ Grade ],
	claims: [ { id: Number, percent: Number } ]

}, { collection: "schools" });

school.plugin(findOneOrCreate);

exports.schema = school;