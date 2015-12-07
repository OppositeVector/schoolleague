var mongoose = require("mongoose");

mongoose.connect(process.env.MONGOLAB_URI);
var con = exports.connection = mongoose.connection;

var TAG = "DBController";

con.once('open',function(err){

	if(err){
		console.log(err);
	}else{
		console.log('Successfully opened production db connection');
	}

});