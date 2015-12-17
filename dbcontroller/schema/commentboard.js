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

	id: Number,
	schoolId: Number,
	comments: [ comment ]

}, { collection: "comments" });

exports.schema = commentboard;