//This uses the simple d3pie configurable script library to generate a basic interactive piechart
//jQuery for reading in static json data for the moment (data.json)
// Initializes an empty array
//Please note that Google Chrome does not allow XMLHttpRequest (data.json) when running files from the local file system, so our json won't be parsed and thus chart cannot be built
//This however will work on Edge and Firefox browswers
var data = [];

// Gets JSON data (label, click/visit/hover metrics - value, color) and waits for the response
d3.json("./data.json", function(error, json) {

  $.each(json, function(d,i){

    data.push({

      label: i.label,

      value: i.value,

      color: i.color

    })

  })

var pie = new d3pie("pieChart", {
	"header": {
		"title": {
			"text": "Unity Usage",
			"fontSize": 24,
			"font": "Arial"
		},
		"subtitle": {
			"text": "Pie Chart to show most used services",
			"color": "#999999",
			"fontSize": 12,
			"font": "Arial"
		},
		"titleSubtitlePadding": 9
	},
	"footer": {
		"color": "#999999",
		"fontSize": 10,
		"font": "Arial",
		"location": "bottom-left"
	},
	"size": {
		"canvasWidth": 590,
		"pieOuterRadius": "90%"
	},
	"data": {
		"sortOrder": "value-desc",
		"content": data
	},
	"labels": {
		"outer": {
			"pieDistance": 32
		},
		"inner": {
			"hideWhenLessThanPercentage": 3
		},
		"mainLabel": {
			"fontSize": 11
		},
		"percentage": {
			"color": "#ffffff",
			"decimalPlaces": 0
		},
		"value": {
			"color": "#adadad",
			"fontSize": 11
		},
		"lines": {
			"enabled": true
		},
		"truncation": {
			"enabled": true
		}
	},
	"effects": {
		"pullOutSegmentOnClick": {
			"effect": "linear",
			"speed": 400,
			"size": 8
		}
	},
	"misc": {
		"gradient": {
			"enabled": true,
			"percentage": 100
		}
	}
});

});
