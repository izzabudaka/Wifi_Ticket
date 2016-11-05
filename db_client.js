var pg = require('pg');
var conString = "postgres://tg_wifi:lepassword@localhost:5432/tg_wifi";

var client = new pg.Client(conString);
client.connect();

this.create_user = function(name, card_num, cvc, exp_month, exp_year, mac_address){
	client.query({
		name: 'create user',
		text: 'INSERT INTO users(mac_address, name, card_number, cvc, exp_month, exp_year) values($1, $2, $3, $4, $5, $6)',
		values: [mac_address, name, card_num, cvc, exp_month, exp_year]
	});
}

this.create_entry = function(mac_address, location_id, timestamp, type, status){
	client.query({
		name: 'create entry',
		text: 'INSERT INTO entry(mac_address, location_id, timestamp, type, status) values($1, $2, $3, $4, $5)',
		values: [mac_address, location_id, timestamp, type, status]
	});
}

this.get_price = function(journies){
	var total = 0
	for(journy in journies){
		client.query("SELECT * FROM prices where start=$1 and destination=$2", [], function(err, result){
			total += result.rows[0]
		})		
	}
	return total
}

this.get_payment_info = function(mac_address){
	client.query("SELECT * from users where mac_address=$1", [mac_address], function(err, result){
		var payment_info = result.rows[0];
		return payment_info;
	});
}

this.set_processed = function(mac_address){
	client.query("UPDATE entry set type='PROCESSED' where mac_address=$1", [mac_address]);
}

this.get_user_journey = function(mac_address){
	client.query({
		name: 'get user journey',
		text: "SELECT * FROM entry where type ='UNPROCESSED' and mac_address=$1 ORDER BY timestamp",
		values: [mac_address],
		function(err, result){
			return result.rows;
		}
	});
}