CREATE TABLE users(
	mac_address varchar(40),
	name varchar(40),
	card_number varchar(40),
	cvc integer,
	exp_month integer,
	exp_year integer,
	CONSTRAINT mac_address PRIMARY KEY(mac_address)
);

CREATE TABLE entry(
	mac_address varchar(40) references users(mac_address),
	location_id integer references locations(location_id) not null,
	timestamp timestamp,
	status varchar(40),
	CONSTRAINT entry_pk PRIMARY KEY(mac_address, timestamp)
);

CREATE TABLE locations(
	location_id SERIAL,
	name varchar(40),
	CONSTRAINT locations_pk PRIMARY KEY(location_id)
);

CREATE TABLE prices(
	start integer references locations(location_id),
	destination integer references locations(location_id),
	price integer not null,
	CONSTRAINT prices_pk PRIMARY KEY(start, destination)
);

GRANT ALL PRIVILEGES ON TABLE users to tg_wifi;
GRANT ALL PRIVILEGES ON TABLE locations to tg_wifi;
GRANT ALL PRIVILEGES ON TABLE entry to tg_wifi;
GRANT ALL PRIVILEGES ON TABLE prices to tg_wifi;