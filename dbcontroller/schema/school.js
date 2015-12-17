"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Position = Schema({
	lon: Number,
	lat: Number
})

var school = Schema({

	id: Number,
	name: String,
	city: Number,
	position: Position,
	data: Schema.Types.Mixed

}, { collection: "schools" });

exports.schema = school;