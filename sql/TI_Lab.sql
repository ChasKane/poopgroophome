

DROP DATABASE innovate_dev_db;
CREATE DATABASE innovate_dev_db;

USE innovate_dev_db;


CREATE TABLE Major (
	major_name VARCHAR(64) NOT NULL UNIQUE,

	PRIMARY KEY (major_name)
);



CREATE TABLE Student (
	student_id int NOT NULL AUTO_INCREMENT,
	student_pid VARCHAR(64) NOT NULL UNIQUE,
	first_name VARCHAR(64) NOT NULL,
	last_name VARCHAR(64) NOT NULL,
	major_name VARCHAR(64) NOT NULL,
	school_email VARCHAR(64) NOT NULL UNIQUE,
	material_used real NOT NULL DEFAULT 0.0,
	soluble_used real NOT NULL DEFAULT 0.0,
	app_token VARCHAR(256),

	PRIMARY KEY (student_id),

	FOREIGN KEY (major_name) 
		REFERENCES Major(major_name)
		ON UPDATE CASCADE
);

CREATE TABLE Student_Token (
	student_id int NOT NULL,
	app_token VARCHAR(64),

	FOREIGN KEY (student_id)
		REFERENCES Student(student_id)
);


CREATE TABLE Lab_Status (
	student_id int NOT NULL,
	date_added DATE NOT NULL,
	time_in DATETIME NOT NULL,
	time_out DATETIME,

	FOREIGN KEY (student_id)
		REFERENCES Student(student_id)
);


CREATE TABLE Club (
	club_name VARCHAR(64) NOT NULL,

	PRIMARY KEY (club_name)
);


CREATE TABLE Student_Club (
	student_id int NOT NULL,
	club_name VARCHAR(64) NOT NULL,

	PRIMARY KEY (student_id, club_name),

	FOREIGN KEY (student_id)
		REFERENCES Student(student_id),

	FOREIGN KEY (club_name)
		REFERENCES Club(club_name)
		ON UPDATE CASCADE
);


CREATE TABLE Lab_Tech (
	tech_id int NOT NULL AUTO_INCREMENT,
	tech_pid VARCHAR(64) NOT NULL UNIQUE,
	name VARCHAR(64) NOT NULL,
	info TEXT,

	PRIMARY KEY (tech_id)
);


CREATE TABLE Lab_Inventory (
	item_id int NOT NULL AUTO_INCREMENT,
	name VARCHAR(64) NOT NULL,
	description TEXT,
	stocked int NOT NULL,
	rentable boolean NOT NULL,
	ti boolean NOT NULL,

	PRIMARY KEY (item_id)
);


CREATE TABLE Laser_Appointment (
	student_id int NOT NULL,
	tech_id int NOT NULL,
	date_added DATE NOT NULL,
	start_time TIME NOT NULL,
	end_time TIME NOT NULL,

	PRIMARY KEY (date_added, start_time),

	FOREIGN KEY (student_id)
		REFERENCES Student(student_id),

	FOREIGN KEY (tech_id)
		REFERENCES Lab_Tech(tech_id)
);


CREATE TABLE Rented_Inventory (
	student_id int NOT NULL,
	item_id int NOT NULL,
	loaned_date DATETIME NOT NULL,
	returned_date DATETIME,
	sacrificed boolean NOT NULL,

	PRIMARY KEY (student_id, item_id, loaned_date),

	FOREIGN KEY (student_id)
		REFERENCES Student(student_id),

	FOREIGN KEY (item_id)
		REFERENCES Lab_Inventory(item_id)
		ON DELETE CASCADE
);




CREATE TABLE Session (
	tech_id int NOT NULL UNIQUE,
	last_updated DATETIME NOT NULL,

	FOREIGN KEY (tech_id)
		REFERENCES Lab_Tech(tech_id)
);


CREATE TABLE FAQ (
	question_id int NOT NULL AUTO_INCREMENT,
	question TEXT NOT NULL,
	answer TEXT NOT NULL,

	PRIMARY KEY (question_id)
);


CREATE TABLE Lab_Hours (
	sunday_open TIME NOT NULL,
	sunday_close TIME NOT NULL,
	monday_open TIME NOT NULL,
	monday_close TIME NOT NULL,
	tuesday_open TIME NOT NULL,
	tuesday_close TIME NOT NULL,
	wednesday_open TIME NOT NULL,
	wednesday_close TIME NOT NULL,
	thursday_open TIME NOT NULL,
	thursday_close TIME NOT NULL,
	friday_open TIME NOT NULL,
	friday_close TIME NOT NULL,
	saturday_open TIME NOT NULL,
	saturday_close TIME NOT NULL
);

CREATE TABLE Appointment_Hours (
	sunday_start TIME NOT NULL,
	sunday_end TIME NOT NULL,
	monday_start TIME NOT NULL,
	monday_end TIME NOT NULL,
	tuesday_start TIME NOT NULL,
	tuesday_end TIME NOT NULL,
	wednesday_start TIME NOT NULL,
	wednesday_end TIME NOT NULL,
	thursday_start TIME NOT NULL,
	thursday_end TIME NOT NULL,
	friday_start TIME NOT NULL,
	friday_end TIME NOT NULL,
	saturday_start TIME NOT NULL,
	saturday_end TIME NOT NULL
);

CREATE TABLE Machine (
	machine_id int NOT NULL AUTO_INCREMENT,
	name VARCHAR(64) NOT NULL,
	type VARCHAR(64) NOT NULL,
	restrictions TEXT,
	date_added DATETIME NOT NULL,
	status VARCHAR(64) DEFAULT 'Working' CHECK (status IN ('Working', 'Broken', 'Maintenance')),

	PRIMARY KEY (machine_id)
);


CREATE TABLE 3DPrint_Queue (
	queue_pos int NOT NULL AUTO_INCREMENT,
	machine_id int NOT NULL,
	student_id int NOT NULL,
	tech_id int NOT NULL,
	date_added DATE NOT NULL,
	time_added TIMESTAMP NOT NULL,
	estimated_time TIME NOT NULL,
	status VARCHAR(12) DEFAULT 'Waiting' CHECK (status IN ('Waiting', 'Cutting', 'Skipped', 'Done')),
	part_name VARCHAR(64),
	file_path TEXT,
	material_amt real NOT NULL,
	soluble_amt real NOT NULL,
	material_name VARCHAR(64) NOT NULL,
	soluble_name VARCHAR(64) NOT NULL,
	club_name VARCHAR(64),

	PRIMARY KEY (queue_pos, machine_id, date_added),

	FOREIGN KEY (machine_id)
		REFERENCES Machine(machine_id)
		ON UPDATE CASCADE,

	FOREIGN KEY (student_id)
		REFERENCES Student(student_id),

	FOREIGN KEY (tech_id)
		REFERENCES Lab_Tech(tech_id)
);


CREATE TABLE Laser_Queue (
	queue_pos int NOT NULL AUTO_INCREMENT,
	machine_id int NOT NULL,
	student_id int NOT NULL,
	tech_id int NOT NULL,
	date_added DATE NOT NULL,
	time_added TIMESTAMP NOT NULL,
	estimated_time TIME NOT NULL,
	status VARCHAR(12) DEFAULT 'Waiting' CHECK (status IN ('Waiting', 'Cutting', 'Skipped', 'Done')),

	PRIMARY KEY (queue_pos, machine_id, date_added),

	FOREIGN KEY (machine_id)
		REFERENCES Machine(machine_id)
		ON UPDATE CASCADE,

	FOREIGN KEY (student_id)
		REFERENCES Student(student_id),

	FOREIGN KEY (tech_id)
		REFERENCES Lab_Tech(tech_id)
);


CREATE TABLE 3DMaterial (
	material_name VARCHAR(64) NOT NULL,
	initial_amount real NOT NULL,
	date_purchased DATETIME NOT NULL,
	num_semesters int NOT NULL,

	PRIMARY KEY (material_name)
);

CREATE TABLE 3DMaterial_Graph (
	material_name VARCHAR(64) NOT NULL,
	today DATE NOT NULL,
	current_amount real NOT NULL,

	PRIMARY KEY (material_name, today),

	FOREIGN KEY (material_name)
		REFERENCES 3DMaterial(material_name)
);

CREATE TABLE Laser_Configuration (
  	config_id int NOT NULL AUTO_INCREMENT,
	material VARCHAR(64) NOT NULL,
	tech_id int NOT NULL,
	thickness real NOT NULL,
	task VARCHAR(64) NOT NULL,
	power float NOT NULL,
	speed float  NOT NULL,
	ppi float NOT NULL,
	notes TEXT,
 
  PRIMARY KEY (config_id),

	FOREIGN KEY (tech_id)
		REFERENCES Lab_Tech(tech_id)
);

CREATE TABLE Message (
	message_id int NOT NULL AUTO_INCREMENT,
	title TEXT NOT NULL,
	body TEXT NOT NULL,

	PRIMARY KEY (message_id)
);

CREATE TABLE Notification (
	student_id int NOT NULL,
	message_id int NOT NULL,
	time_sent DATETIME NOT NULL,
	seen boolean NOT NULL,

	FOREIGN KEY (student_id)
		REFERENCES Student(student_id),

	FOREIGN KEY (message_id)
		REFERENCES Message(message_id)
);