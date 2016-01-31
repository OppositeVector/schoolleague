"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var authority = exports.schema = Schema({
	_id: { type: Number, required: true},
	name: String,
	cities: [ String ],
	schools: [ Number ]
}, { collection: "authorities"});

var aliases = [
	{ pattern: "^תל[-|\\s]אביב", trans: "תל אביב יפו"}
]

var regex_parts = [];
for (var i = 0; i < aliases.length; ++i) {
	regex_parts.push('(' + aliases[i].pattern + ')');
}
var regex = new RegExp(regex_parts.join('|'), 'g');
console.log(regex_parts);
console.log(regex);

exports.GetAlias = function(city) {

	var result = regex.exec(city);
	console.log(result);
	if (result !== null) {
		for (var i = 0; i < aliases.length; i++) {
			// Find the matching rulea SO question
			if (result[i + 1] !== undefined) {
				return aliases[i].trans;
			}
		}
	}

	return city;

}