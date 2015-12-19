// GetSchool?id=<schoolId> returns all the info about the a certain school
// GetCity?name=<cityName> returns all the schools in a city
// GetSchools returns all the schools in database, id,
// test?<whatever> is for me to do tests on

// The structure of the returned queries will ALWAYS be: { result: 0/1, data: <data> }, the result tells if the operation was
// successfull or it failed

"use strict";

var url = require("url");
var bodyParser = require('body-parser');
var express = require("express");
var app = express();

var dbc = require("./dbcontroller/dbcontroller");

var port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static("./public"));
app.use("/upload", express.static("./public/parser"));

app.get("/GetSchools", function(req, res) {

	dbc.GetBasicSchoolsInfo(function(err, data) {

		if(err) {
			res.json({ result: 0, data: err });
			return;
		}

		res.json({ result: 1, data: data });

	})

});

app.get("/GetSchool", function(req, res) {

	var id = url.parse(req.url,true).query.id;

	dbc.GetSchool(id, function(err, data) {

		if(err) {
			res.json({ result: 0, data: err });
			return;
		}

		res.json({ result: 1, data: data });

	});

});

app.get("/GetCity", function(req, res) {

	var name = url.parse(req.url,true).query.name;

	dbc.GetCityByName(name, function(err, data) {

		if(err) {
			res.json({ result: 0, data: err });
			return;
		}

		res.json({ result: 1, data: data });

	});

});

app.get("/test", function(req, res) {

	// var searchTerm = url.parse(req.url,true).query.searchTerm;
	var type = url.parse(req.url,true).query.type;
	console.log(type);

	dbc.TestConfig(type, function(err, data) {

		if(err) {
			res.json({ result: 0, data: err });
		} else {
			res.json({ result: 1, data: data });
		}

	});

});

app.post("/test", function(req, res) {

	var school = req.body;

	// console.log(req.body);

	dbc.RecieveSchool(school, function(err, data) {

		if(err) {
			res.json({ result: 0, data: err });
		} else {
			res.json({ result: 1, data: data });
		}

	});

});

app.listen(port);
console.log('listen on port ' + port);