--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.4
-- Dumped by pg_dump version 9.5.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: entry; Type: TABLE; Schema: public; Owner: izzabudaka
--

CREATE TABLE entry (
    mac_address character varying(40) NOT NULL,
    location_id integer NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    status character varying(40)
);


ALTER TABLE entry OWNER TO izzabudaka;

--
-- Name: locations; Type: TABLE; Schema: public; Owner: izzabudaka
--

CREATE TABLE locations (
    location_id integer NOT NULL,
    name character varying(40)
);


ALTER TABLE locations OWNER TO izzabudaka;

--
-- Name: locations_location_id_seq; Type: SEQUENCE; Schema: public; Owner: izzabudaka
--

CREATE SEQUENCE locations_location_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE locations_location_id_seq OWNER TO izzabudaka;

--
-- Name: locations_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: izzabudaka
--

ALTER SEQUENCE locations_location_id_seq OWNED BY locations.location_id;


--
-- Name: prices; Type: TABLE; Schema: public; Owner: izzabudaka
--

CREATE TABLE prices (
    start integer NOT NULL,
    destination integer NOT NULL,
    price integer NOT NULL
);


ALTER TABLE prices OWNER TO izzabudaka;

--
-- Name: users; Type: TABLE; Schema: public; Owner: izzabudaka
--

CREATE TABLE users (
    mac_address character varying(40) NOT NULL,
    name character varying(40),
    card_number character varying(40),
    cvc integer,
    exp_month integer,
    exp_year integer
);


ALTER TABLE users OWNER TO izzabudaka;

--
-- Name: location_id; Type: DEFAULT; Schema: public; Owner: izzabudaka
--

ALTER TABLE ONLY locations ALTER COLUMN location_id SET DEFAULT nextval('locations_location_id_seq'::regclass);


--
-- Data for Name: entry; Type: TABLE DATA; Schema: public; Owner: izzabudaka
--

COPY entry (mac_address, location_id, "timestamp", status) FROM stdin;
banana_nana	1	2011-05-16 15:36:38	UNPROCESSED
banana_nana	9	2016-10-24 20:42:59	UNPROCESSED
banana_nana	2	2016-10-25 07:06:59	UNPROCESSED
banana_nana	5	2016-10-25 07:08:59	UNPROCESSED
banana_nana	3	2016-10-25 07:09:59	UNPROCESSED
banana_nana	3	2016-10-25 16:20:59	UNPROCESSED
banana_nana	5	2016-10-25 16:25:59	UNPROCESSED
banana_nana	5	2016-10-25 16:55:59	UNPROCESSED
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: izzabudaka
--

COPY locations (location_id, name) FROM stdin;
1	lyon
2	paris
3	london
4	tokyo
5	manchester
6	brighton
7	norwich
8	Blackpool
9	Edinburgh
10	Glasgow
\.


--
-- Name: locations_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: izzabudaka
--

SELECT pg_catalog.setval('locations_location_id_seq', 10, true);


--
-- Data for Name: prices; Type: TABLE DATA; Schema: public; Owner: izzabudaka
--

COPY prices (start, destination, price) FROM stdin;
2	3	40
3	5	50
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: izzabudaka
--

COPY users (mac_address, name, card_number, cvc, exp_month, exp_year) FROM stdin;
banana_nana	Bartoosh	123456789	123	12	1999
\.


--
-- Name: entry_pk; Type: CONSTRAINT; Schema: public; Owner: izzabudaka
--

ALTER TABLE ONLY entry
    ADD CONSTRAINT entry_pk PRIMARY KEY (mac_address, "timestamp");


--
-- Name: locations_pk; Type: CONSTRAINT; Schema: public; Owner: izzabudaka
--

ALTER TABLE ONLY locations
    ADD CONSTRAINT locations_pk PRIMARY KEY (location_id);


--
-- Name: mac_address; Type: CONSTRAINT; Schema: public; Owner: izzabudaka
--

ALTER TABLE ONLY users
    ADD CONSTRAINT mac_address PRIMARY KEY (mac_address);


--
-- Name: prices_pk; Type: CONSTRAINT; Schema: public; Owner: izzabudaka
--

ALTER TABLE ONLY prices
    ADD CONSTRAINT prices_pk PRIMARY KEY (start, destination);


--
-- Name: entry_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: izzabudaka
--

ALTER TABLE ONLY entry
    ADD CONSTRAINT entry_location_id_fkey FOREIGN KEY (location_id) REFERENCES locations(location_id);


--
-- Name: entry_mac_address_fkey; Type: FK CONSTRAINT; Schema: public; Owner: izzabudaka
--

ALTER TABLE ONLY entry
    ADD CONSTRAINT entry_mac_address_fkey FOREIGN KEY (mac_address) REFERENCES users(mac_address);


--
-- Name: prices_destination_fkey; Type: FK CONSTRAINT; Schema: public; Owner: izzabudaka
--

ALTER TABLE ONLY prices
    ADD CONSTRAINT prices_destination_fkey FOREIGN KEY (destination) REFERENCES locations(location_id);


--
-- Name: prices_start_fkey; Type: FK CONSTRAINT; Schema: public; Owner: izzabudaka
--

ALTER TABLE ONLY prices
    ADD CONSTRAINT prices_start_fkey FOREIGN KEY (start) REFERENCES locations(location_id);


--
-- Name: public; Type: ACL; Schema: -; Owner: izzabudaka
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM izzabudaka;
GRANT ALL ON SCHEMA public TO izzabudaka;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: entry; Type: ACL; Schema: public; Owner: izzabudaka
--

REVOKE ALL ON TABLE entry FROM PUBLIC;
REVOKE ALL ON TABLE entry FROM izzabudaka;
GRANT ALL ON TABLE entry TO izzabudaka;
GRANT ALL ON TABLE entry TO tg_wifi;


--
-- Name: locations; Type: ACL; Schema: public; Owner: izzabudaka
--

REVOKE ALL ON TABLE locations FROM PUBLIC;
REVOKE ALL ON TABLE locations FROM izzabudaka;
GRANT ALL ON TABLE locations TO izzabudaka;
GRANT ALL ON TABLE locations TO tg_wifi;


--
-- Name: prices; Type: ACL; Schema: public; Owner: izzabudaka
--

REVOKE ALL ON TABLE prices FROM PUBLIC;
REVOKE ALL ON TABLE prices FROM izzabudaka;
GRANT ALL ON TABLE prices TO izzabudaka;
GRANT ALL ON TABLE prices TO tg_wifi;


--
-- Name: users; Type: ACL; Schema: public; Owner: izzabudaka
--

REVOKE ALL ON TABLE users FROM PUBLIC;
REVOKE ALL ON TABLE users FROM izzabudaka;
GRANT ALL ON TABLE users TO izzabudaka;
GRANT ALL ON TABLE users TO tg_wifi;


--
-- PostgreSQL database dump complete
--

