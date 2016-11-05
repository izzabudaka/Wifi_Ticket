var express = require("express");
var db_client = require("./db_client.js");
var payment_processor = require("./payment_processor.js");
var journey_processor = require("./journey_processor.js");
var app = express();

/* serves main page */
app.get("/", function(req, res) {
	res.sendfile('index.htm')
});

app.post("/user/add", function(req, res) { 
	db_client.create_user(req.body.name, req.body.card_num, req.body.cvc,
						  req.body.exp_month, req.body.exp_year, req.body.mac_address);
	res.send("OK");
});

app.post("/entry/add", function(req, res) { 
	db_client.create_entry(req.body.mac_address, req.body.location_id,
						   req.body.timestamp, req.body.type, req.body.status);
	res.send("OK");
});

app.get("/user/journies", function(req, res) { 
	var result = db_client.get_journies(req.body.mac_address);
	res.send(JSON.parse(result));
});

app.post("/user/pay", function(req, res) {
	var unpaid = db_client.get_journies(req.body.mac_address);
	var journies = journey_processor.partition_journey(unpaid);

	var price = db_client.get_price(journies);
	var payment_info = db_client.get_payment_info(req.body.mac_address);
	payment_processor.pay(price, payment_info);
	db_client.set_processed(req.body.mac_address);
	res.send("User paid " + price);
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
	console.log("Listening on " + port);
});