"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var city = Schema({

	id: Number,
	name: String,
	schools: [ Schema.Types.ObjectId ]

}, { collection: "cities" });

exports.schema = city;