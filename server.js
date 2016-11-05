var express = require("express");
var db_client = require("./db_client.js");
var payment_processor = require("./payment_processor.js");
var journey_processor = require("./journey_processor.js");
var bodyParser = require('body-parser')
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
	db_client.create_entry(req.body.mac_address, req.body.location_id,
						   req.body.timestamp, "UNPROCESSED");
	res.send("OK");
});

app.get("/user/journies/:mac_address", jsonParser, function(req, res) { 
	db_client.get_user_journey(req.params.mac_address, function(result){
		res.send(result);
	});
});

app.get("/user/journies/:mac_address/grouped", jsonParser, function(req, res) { 
	db_client.get_user_journey(req.body.mac_address, function(result) {
		var unnamed = journey_processor.partition_journey(result);
		for(idx in unnamed){
			var location = db_client.get_location_name(unnamed[idx].location_id)
			unnamed[idx]["location_name"] = location
		}
		res.send(unnamed);
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

var port = process.env.PORT || 5000;

app.listen(port, function() {
	console.log("Listening on " + port);
});