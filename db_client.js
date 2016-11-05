var pg = require('pg');
var config = {
  user: 'tg_wifi',
  database: 'tg_wifi',
  password: 'lepassword',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
};
 
// trollolol enjoy the merge conflict
var pool = new pg.Pool(config);

this.create_user = function(name, card_num, cvc, device_id, exp_month, exp_year, mac_address){
	pool.connect(function(err, client, done){
		client.query(
			'INSERT INTO users(mac_address, name, card_number, cvc, exp_month, exp_year, device_id) values($1, $2, $3, $4, $5, $6, $7)',
			[mac_address, name, card_num, cvc, device_id, exp_month, exp_year],
			function(err, result){
				done()
				if(err)
					console.log('error running query', err)
			});
	})
}

this.get_device_id = function(mac_address, callback){
	pool.connect(function(err, client, done) {
		client.query("SELECT device_id FROM users where mac_address=$1",
			[mac_address],
			function(err, result){
				done()
				if(err)
					console.log('err running query', err)
				console.log(result)
				callback(result.rows[0].device_id)
			}
		)}
	)
}

this.create_entry = function(mac_address, location_id, timestamp, status, callback){
	pool.connect(function(err, client, done){
		client.query('INSERT INTO entry(mac_address, location_id, timestamp, status) values($1, $2, $3, $4)',
			[mac_address, location_id, timestamp, status],
			function(err, result){
				done()
				if(err)
					console.log('err running query', err)
				callback();
			});
	})
}

this.get_price = function(journy, callback) {
	// TODO: INCLUDE peak time and off peak
	
	pool.connect(function(err, client, done) {
		client.query("SELECT price FROM prices where start=$1 and destination=$2",
			[parseInt(journy.start.location_id), parseInt(journy.destination.location_id)],
			function(err, result){
				done()
				if(err)
					console.log('err running query', err)
				console.log(result)
				callback(result.rows[0].price)
			}
		)}
	)
}

this.get_payment_info = function(mac_address, callback){
	pool.connect(function(err, client, done){
		client.query("SELECT * from users where mac_address=$1", [mac_address], function(err, result){
			done()
			if(err)
				console.log('err running query', err)
			console.log(result)
			callback(result.rows[0])
		});
	})
}

this.set_processed = function(mac_address){
	pool.connect(function(err, client, done){
		client.query("UPDATE entry set status='PROCESSED' where mac_address=$1", [mac_address],
			function(err, result) {
				done()
				if(err)
					console.log('err running query', err)
			})
	})
}

this.get_location_name = function(location_id){
	pool.connect(function(err, client, done) {
		client.query("SELECT name FROM locations where location_id=$1",
			[location_id],
			function(err, result){
				done()
				if(err)
					console.log('err running query', err)
				callback(result.rows[0].name)
			}
		)}
	)
}

this.get_user_journey = function(mac_address, callback){
	pool.connect(function(err, client, done){
		client.query("SELECT * FROM entry where status ='UNPROCESSED' and mac_address=$1 ORDER BY timestamp",
			[mac_address],
			function(err, result){
				done()
				if(err)
					console.log('err running query', err)
				callback(result.rows)
			})
	})
}
