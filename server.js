var express = require("express");
var async = require('async');
var bodyParser = require('body-parser');

var db_client = require("./db_client.js");
var payment_processor = require("./payment_processor.js");
var journey_processor = require("./journey_processor.js");
var notification_processor = require("./notification_processor.js");

var app = express();

var jsonParser = bodyParser.json()

/* serves main page */
app.get("/", function(req, res) {
	res.sendfile('index.htm')
});

app.post("/user/add", jsonParser, function(req, res) { 
	db_client.create_user(req.body.name, req.body.card, req.body.cvc, req.body.device_id,
						  req.body.month, req.body.year, req.body.mac_address);
	res.send("OK");
});

app.post("/entry/add", jsonParser, function(req, res) {
    console.log(req.body);
	db_client.create_entry(req.body.mac_address, req.body.location_id,
				   		   req.body.timestamp, "UNPROCESSED");
});

app.get("/user/journies/:mac_address", jsonParser, function(req, res) { 
	db_client.get_user_journey(req.params.mac_address, function(result){
		res.send(result);
	});
});

app.get("/user/journies/:mac_address/grouped", jsonParser, function(req, res) { 
	console.log(new Date())
	db_client.get_user_journey(req.params.mac_address, function(result) {
		var unnamed = journey_processor.partition_journey_with_ones(result);
		async.forEach(unnamed, function (item, callback){ 
			db_client.get_location_name(item.start.location_id, function(name){
				item.start["location_name"] = name
				db_client.get_location_name(item.destination.location_id, function(name){
					item.destination["location_name"] = name
					callback()
				})
			})
		}, function(err) {
			result = {}
			var diff = new Date() - new Date(unnamed[unnamed.length-1].destination.timestamp);
			var diffMins = Math.abs(Math.round(((diff % 86400000) % 3600000) / 60000));
			if(diffMins > 15){
				res.send({});
			} else{
				db_client.get_price(unnamed[unnamed.length-1], function(nPrice) {
					result["price"] = nPrice
					result["destination"] = capitalizeFirstLetter(unnamed[unnamed.length-1].destination.location_name)
					result["start"] = capitalizeFirstLetter(unnamed[unnamed.length-1].start.location_name)
					res.send({"data": result});
				});
			}
		});  
	});
});

app.post("/user/pay", jsonParser, function(req, res) {
	db_client.get_user_journey(req.body.mac_address, function(unpaid) {
		var journies = journey_processor.partition_journey(unpaid);
		var price = 0
		for(idx in journies) {
			db_client.get_price(journies[idx], function(nPrice) {
				console.log(nPrice)
				price += nPrice
			});
		}
 		
		db_client.get_payment_info(req.body.mac_address, function(payment_info){
			payment_processor.pay(price, payment_info);
			db_client.set_processed(req.body.mac_address);
			res.send("User paid " + price);
		});
	});
});

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

var port = process.env.PORT || 5000;

app.listen(port, function() {
	console.log("Listening on " + port);
});