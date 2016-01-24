
var weights = exports.weights = [
	[ 100 ],
	[ 60, 40 ],
	[ 50, 30, 20 ],
	[ 45, 25, 20, 10 ],
	[ 40, 20, 17.5, 12.5, 10 ]
]

// Claims are offset by -1 because the first claim stands on index 0, but its name is claim1
var criteria = exports.criteria = [
	{
		name: "Teachers Satisfaction",
		id: 0,
		claims: [ 0, 5, 13, 36, 48, 68 ]
	}, 
	{
		name: "Student Satisfaction",
		id: 1,
		claims: [ 44, 45, 58, 63 ]
	},
	{
		name: "Teacher to Student Violence",
		id: 2,
		claims: [ 34 ]
	},
	{
		name: "Student Safty",
		id: 3,
		claims: [ 3, 11, 17, 24, 33, 43, 46, 47, 52, 53, 60, 62, 70, 76 ]
	},
	{
		name: "Class Management",
		id: 4,
		claims: [ 18, 57, 78 ]
	},
	{
		name: "School Attitude on Violence",
		id: 5,
		claims: [ 1, 12, 71, 72, 77 ]
	},
	{
		name: "Teacher Personal Treatment",
		id: 6,
		claims: [ 8, 16, 22, 25, 26, 27, 31, 39, 49, 54, 66, 80 ]
	},
	{
		name: "Teacher Learning Treatment",
		id: 7,
		claims: [ 2, 9, 10, 15, 19, 32, 35, 37, 38, 41, 55, 56, 61, 65, 67, 74, 75 ]
	},
	{
		name: "Student Attitude Towards School",
		id: 8,
		claims: [ 29, 42, 79 ]
	},
	{
		name: "Social Attitude",
		id: 9,
		claims: [ 4, 14, 20, 28, 30, 40, 51, 64, 69 ]
	},
	{
		name: "Differential Learning",
		id: 10,
		claims: [ 6, 7, 21, 23, 59, 73 ]
	},
	{
		name: "Social Activities",
		id: 11,
		claims: [ 50 ]
	}
]

// schools: an array of all the schools data that needs to be filtered
// params: an array of the parameters that will be used to filter the schools,
// 		the parameters are the ids written above.
// the function will take the avarage between the years in the school data
exports.Filter = function(schools, params) {

	var w = weights[params.length - 1];
	var total = 0;
	var normalizedWeights = [];
	for(var i = 0; i < w.length; ++i) {
		total += w[i];
	}
	for(var i = 0; i < w.length; ++i) {
		normalizedWeights.push(w[i] / total);
	}

	var retVal = [];
	var max = 0;
	var min = 12301201230123;
	for(var i = 0; i < schools.length; ++i) {

		var cur = schools[i];
		var values = [];
		var valuesTotal = 0;

		for(var j = 0; j < params.length; ++j) {

			var val = 0;
			for(var k = 0; k < params[j].claims.length; ++k) {

				for(var l = 0; l < cur.claims.length; ++l) {

					var tmp = cur.claims[l].percent[params[j].claims[k]] * normalizedWeights[j];
					if(!isNaN(tmp) && (tmp >= 0)) {
						val = (tmp + val) / 2;
					}

				} 

			}

			valuesTotal = (valuesTotal + val) / 2;
			values.push(val);

		}

		retVal.push({ 
			id: cur._id,
			name: cur.name,
			position: cur.position,
			total: valuesTotal
		});

		if(valuesTotal > max) {
			max = valuesTotal;
		}
		if(valuesTotal < min) {
			min = valuesTotal;
		}

	}

	var delta = max - min;
	// Normalize values
	for(var i = 0; i < retVal.length; ++i) {
		retVal[i].total = (retVal[i].total - min) / delta;
	}

	return retVal;

}