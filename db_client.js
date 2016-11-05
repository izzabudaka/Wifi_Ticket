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

this.create_user = function(name, card_num, cvc, exp_month, exp_year, mac_address){
	pool.connect(function(err, client, done){
		client.query(
			'INSERT INTO users(mac_address, name, card_number, cvc, exp_month, exp_year) values($1, $2, $3, $4, $5, $6)',
			[mac_address, name, card_num, cvc, exp_month, exp_year],
			function(err, result){
				done()
				if(err)
					console.log('error running query', err)
			});
	})
}

this.create_entry = function(mac_address, location_id, timestamp, status){
	pool.connect(function(err, client, done){
		client.query('INSERT INTO entry(mac_address, location_id, timestamp, status) values($1, $2, $3, $4)',
			[mac_address, location_id, timestamp, status],
			function(err, result){
				done()
				if(err)
					console.log('err running query', err)
			});
	})
}

this.get_price = function(journies){
	var total = 0
	for(journy in journies){
		pool.connect(function(err, client, done){
			client.query("SELECT * FROM prices where start=$1 and destination=$2",
				[journy[0], journy[1]],
				function(err, result){
					done()
					if(err)
						console.log('err running query', err)
					total += result.rows[0]
				}
			)}
		)
	}
	return total
}

this.get_payment_info = function(mac_address, callback){
	pool.connect(function(err, client, done){
		client.query("SELECT * from users where mac_address=$1", [mac_address], function(err, result){
			done()
			if(err)
				console.log('err running query', err)
			callback(result.rows[0])
		});
	})
}

this.set_processed = function(mac_address){
	pool.connect(function(err, client, done){
		client.query("UPDATE entry set type='PROCESSED' where mac_address=$1", [mac_address],
			function(err, result) {
				done()
				if(err)
					console.log('err running query', err)
			})
	})
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
