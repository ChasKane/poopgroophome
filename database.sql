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
    address VARCHAR(50) NOT NULL
);

# Create user
# INSERT INTO users VALUES ("user", "pass");

# Create contact
# INSERT INTO contacts VALUES (user_id, "first", "last", "address");

# Get user's contacts
# SELECT * FROM contacts WHERE user_id = 0;

# Delete a contact
# DELETE * FROM contacts WHERE contact_id = 0;

# Delete a user (and their contacts)
# DELETE * FROM users WHERE user_id = 0;
# DELETE * FROM contacts where user_id = 0;