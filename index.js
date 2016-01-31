// GetSchool?id=<schoolId> returns all the info about the a certain school
// GetCity?name=<cityName> returns all the schools in a city
// GetSchools returns all the schools in database, id,
// GetComments?id=<schoolId> returns all the comments asociated with the school
// PostComment should be used in post, writes a comment to the database, format:
//		{ 
//			school: <schoolId>,
//			poster: <posterName>,
//			content: <commentText>,
//			path: <pathToParentComment>
//		}
//	path is used to place a comment under another comment, format: <num> <num> <num> ...
//	each number denotes the index in the comments data set leading to the desired sub child of the tree
//	the request will eventually return the updated comment block
// GetClaims returns the strings corresponding to the claims array index in each school
// test?<whatever> is for me to do tests on

// The structure of the returned queries will ALWAYS be: { result: 0/1, data: <data> }, the result tells if the operation was
// successfull or it failed

"use strict";

var fs = require("fs");
var url = require("url");
var bodyParser = require('body-parser');
var express = require("express");
var app = express();

var dbc = require("./dbcontroller/dbcontroller");
var filter = require("./dbcontroller/filter");

var port = process.env.PORT || 8080;

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static("./public"));
// app.use("/upload", express.static("./parser"));

app.get("/GetSchools", function(req, res) {

	dbc.GetBasicSchoolsInfo(function(err, data) {

		if(err) {
			res.json({ result: 0, data: err });
			return;
		}

		for(var i = 0; i < data.length; ++i) {
			data[i].id = data[i]._id;
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

		data.id = data._id;
		res.json({ result: 1, data: data });

	});

});

app.get("/GetCity", function(req, res) {

	var queryObject = url.parse(req.url,true).query;
	var name = queryObject.name;
	var area = queryObject.area;

	dbc.GetCityByName(name, function(err, data) {

		if(err) {
			res.json({ result: 0, data: err });
			return;
		}

		// if(data.length > 0) {

			for(var i = 0; i < data.length; ++i) {
				data[i].id = data[i]._id;
				if(data[i].fromClass > 1) {
					data.splice(i, 1);
					--i;
				}
			}
			res.json({ result: 1, data: data });
			return;

		// }

		// if(data.length == 0) {

		// 	if(area != null) {
		// 		dbc.GetAuthoritySchools(area, function(err, data) {
		// 			if(err) {
		// 				res.json({ result: 0, data: err });
		// 				return;
		// 			}
		// 			for(var i = 0; i < data.length; ++i) {
		// 				data[i].id = data[i]._id;
		// 				if(data[i].fromClass > 1) {
		// 					data.splice(i, 1);
		// 					--i;
		// 				}
		// 			}
		// 			res.json({ result: 1, data: data });
		// 			return;
		// 		});
		// 	}
			
		// }

	});

});

app.get("/GetComments", function(req, res) {

	var school = url.parse(req.url,true).query.id;

	// console.log("id: " + school);

	dbc.GetComments(school, function(err, commentsData) {

		if(err) {
			res.json({ result: 0, data: err });
		} else {

			// console.log(commentsData + " " + school);
			if(commentsData == null) {
				commentsData = {
					id: school,
					replies: []
				}
			} else {
				commentsData.id = commentsData._id;
			}

			res.json({ result: 1, data: commentsData });

		}

	});

});

app.post("/PostComment", function(req, res) {

	var comment = req.body;

	dbc.PostComment(comment, function(err, allComments) {

		if(err) {
			res.json({ result: 0, data: err });
		} else {
			res.json({ result: 1, data: allComments });
		}

	});

});

app.get("/GetFilterData", function(req, res) {

	res.json({
		result: 1, 
		data: { 
			weights: filter.weights,
			criteria: filter.criteria
		}
	});

});

app.get("/Filter", function(req, res) {

	var params = url.parse(req.url,true).query;
	dbc.GetCityByName(params.city, function(err, schools) {
		var filteredData = filter.Filter(schools, params.p1, params.p2, params.p3, params.p4, params.p4);
		res.json({ result: 1, data: filteredData });
	});

});

app.get("/GetAuthority", function(req, res) {

	var id = url.parse(req.url,true).query.id;

	dbc.GetAuthority(id, function(err, data) {

		if(err) {
			res.json({ result: 0, data: err });
		} else {
			res.json({ result: 1, data: data });
		}

	});

});

app.get("/test", function(req, res) {

	dbc.GetSchoolsWithDataAndRunFunction({ "position.lat": 360 }, dbc.AggregateSchoolData, function(err, data) {

		if(err) {
			res.json({ result: 0, data: err });
		} else {
			res.json({ result: 1, data: data });
		}

	});

});

function RecursiveDataInsertion(data, index) {

	dbc.RecieveSchool(data[index], function(err, school) {

		console.log(" ");
		if(err) {
			school.index = index;
			console.log(school);
		} else {
			console.log("Success on " + index);
		}
		++index;
		if(index < data.length) {
			RecursiveDataInsertion(data, index);
		} else {
			console.log("Finished recieving data");
		}

	});

}

app.post("/RecieveBudget", function(req, res) {

	res.json({ result: 1, data: "Recieved" });

	var data = req.body;

	dbc.RecieveBudget(data, function(err, info) {

		if(err) {
			console.log(err);
			return;
		}

		console.log(info);

	});

});

app.post("/RecieveData", function(req, res) {

	res.json({ result: 1, data: "Recieved" });

	var data = req.body;
	data.splice(0, 1);

	dbc.RecieveData(data, function(err, info) {

		if(err) {
			console.log(err);
			return;
		}

		console.log(info);

	});

});

var sc = require("./dbcontroller/schema/school");
var last;

app.post("/RecieveClaims", function(req, res) {

	// res.json({ result: 1, data: "Data recieved" });

	var data = req.body;

	data.splice(data.length - 1, 1);
	data.splice(0, 1);

	var test = {};
	for(var i = 0; i < data[0].length; ++i) {
		sc.SetAtIndex(data[0][i], i, test);
	}
	var t2 = [];
	for(var i = 0; i < data[0].length; ++i) {
		t2.push(sc.GetAtIndex(i, test));
	}

	last = {
		result: 1,
		orig: data[0],
		inserted: test,
		extracted: t2
	}

	res.json({
		result: 1
	});

	// dbc.RecieveClaims(data);

});

app.get("/last", function(req, res) {
	res.json(last);
})

app.get("/GetClaims", function(req, res) {
	res.json(claims);
});

app.get("/test2", function(req, res) {

	var index = url.parse(req.url,true).query.index;
	var normalized = index - 22;
	var yearOffset = Math.floor(normalized / 15);
	var year = 2009 + yearOffset;
	var classOffset = Math.floor((normalized - (yearOffset * 15)) / 5);
	var grade;
	if(classOffset == 0) {
		grade = "b"
	} else if(classOffset == 1) {
		grade = "e";
	} else {
		grade = "h";
	}
	var subjectOffset = normalized - (yearOffset * 15) - (classOffset * 5);
	var subject;
	if(subjectOffset == 0) {
		subject = "english";
	} else if(subjectOffset == 1) {
		subject = "tech";
	} else if(subjectOffset == 2) {
		subject = "math";
	} else if(subjectOffset == 3) {
		subject = "hebrew";
	} else if(subjectOffset == 4) {
		subject = "arabic"
	}
	res.json({ 
		result: 1, 
		data: { 
			normalized: normalized,
			year: year,
			grade: grade,
			subject: subject,

		} 
	});

});

app.get("/Generate", function(req, res) {



});

var claims;
fs.readFile("claims.json", function(err, data) {

	if(err) {
		console.log(err);
		return;
	}
	console.log(data);
	claims = JSON.parse(data);

	app.listen(port);
	console.log('listen on port ' + port);

});
