CREATE DATABASE test;

USE test;

CREATE TABLE users (
	user_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	fname VARCHAR(20) NOT NULL,
	lname VARCHAR(20) NOT NULL,
	username VARCHAR(20) NOT NULL UNIQUE,
	password VARCHAR(20) NOT NULL
);

CREATE TABLE contacts (
	contact_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	user_id int NOT NULL,
	fname VARCHAR(20) NOT NULL,
	lname VARCHAR(20) NOT NULL,
	address VARCHAR(50) NOT NULL,
	city VARCHAR(20) NOT NULL,
	state VARCHAR(20) NOT NULL,
	zip_code int NOT NULL
);

# Create user (Don't worry about the null value, the ID will auto-increment)
# INSERT INTO users VALUES (null, first_name, last_name, username, password);

# Create contact
# INSERT INTO contacts VALUES (null, user_id, first_name, last_name, address, city, state, zip_code);

# Get user 0's contacts
# SELECT * FROM contacts WHERE user_id = 0;

# Delete contact 0
# DELETE * FROM contacts WHERE contact_id = 0;

# Delete user 0 (and their contacts)
# DELETE * FROM users WHERE user_id = 0;
# DELETE * FROM contacts where user_id = 0;