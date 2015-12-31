var app = angular.module("CommentsTester",[]);

var model = {
	school: 540187,
	schoolData: {
		replies : []
	},
	message: "",
	poster: "",
}

app.run(function() {

});

function RecFormatModel(current, path) {

	if(current.time != null) {
		current.time = new Date(current.time).toString();
	}

	current.reply = {
		visible: false,
		poster: "",
		message: "",
		path: path
	}

	for(var i = 0; i < current.replies.length; ++i) {
		RecFormatModel(current.replies[i], (path == null) ? (i.toString()) : (path + " " + i));
	}

}

function StringEmpty(str) {
	return (!str || !str.trim());
}

app.controller("BodyController", [ "$scope", "$http", "$location", function($scope, $http, $location) {

	$scope.model = model;

	function PostReply(reply) {

		if(!StringEmpty(reply.message)) {

			comment = {
				content: reply.message,
				school: model.school,
				path: reply.path
			}


			if(!StringEmpty(reply.poster)) {
    			comment.poster = reply.poster;
    		} else {
    			comment.poster = "Anonymouse";
    		}

    		$http.post("../PostComment", comment).success(function(data, status, headers, config) {

    			if(data.result == 1) {
		            console.log(data.data);
		            model.schoolData = data.data;
		            RecFormatModel(model.schoolData);
		        } else {
		            console.log("Failed to send data to server: " + data.result.data);
		        }

		        poster.val("");
		        message.val("");

    		}).error(function(data, status, headers, config) {
    			console.log(data);
        		console.log(status);
        		console.log(headers);
    		});

		} else {
			reply.visible = false;
		}

	}

	$scope.PostReply = PostReply;

	$http.get("../GetComments?id=" + model.school).success(function(data, status, headers, config) {

        if(data.result == 1) {
            console.log(data.data);
            model.schoolData = data.data;
            RecFormatModel(model.schoolData);
        } else {
            console.log("Failed to send data to server: " + data.result.data);
        }

    }).error(function(data, status, headers, config) {
        console.log(data);
        console.log(status);
        console.log(headers);
    });

    var poster = $("#poster");
    var message = $("#message");

}]);