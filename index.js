"use strict";

var express = require("express");
var app = express();

var dbc = require("./dbcontroller/dbcontroller");

var port = process.env.PORT || 8080;

app.use("/", express.static("./public"));

app.get("/test", function(req, res) {



});

app.listen(port);
console.log('listen on port ' + port);