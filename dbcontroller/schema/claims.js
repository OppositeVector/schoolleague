"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Claim = exports.single = Schema({
	id: Number,
	percent: Number
});

var Claims = exports.arr = Schema({
	arr: [ String ]
}, { collection: "claims" });