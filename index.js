"use strict";

var bodyParser = require('body-parser');
var express = require("express");
var app = express();

var dbc = require("./dbcontroller/dbcontroller");

var port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static("./public"));

app.get("/GetSchool", function(req, res) {

	var id = req.body.id;

	dbc.GetSchool(id, function(err, data) {

		if(err) {
			res.json({ result: 0, data: err });
			return;
		}

		res.json({ result: 1, data: data });

	});

});

app.get("/GetCity", function(req, res) {

	res.json({ 
		result: 1,
		data: {
			name : "Ness-zionna",
			schools: [ {
					id: 1,
					name: "Ben Gurion",
					pos: { lon: 34.793216, lat: 31.934172 },
					data: "All the data about the school will probably be here"
				}, {
					id: 2,
					name: "Hadar",
					pos: { lon: 34.804809, lat: 31.932980 },
					data: "This is the elementry school i went to"
				}
			]
		}
	})

});

app.get("/test", function(req, res) {



});

app.listen(port);
console.log('listen on port ' + port);