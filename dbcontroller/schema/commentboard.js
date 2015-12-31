"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var comment = Schema({

	poster: String,
	time: Number,
	content: String

});

comment.add({ replies: [ comment ] });

var commentboard = Schema({

	_id: { type: Number, required: true },
	replies: [ comment ]

}, { collection: "comments" });

exports.schema = commentboard;