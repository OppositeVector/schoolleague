"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var authority = exports.schema = Schema({
	_id: { type: Number, required: true},
	name: String,
	cities: [ String ],
	schools: [ Number ]
}, { collection: "authorities"});