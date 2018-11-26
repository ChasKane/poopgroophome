USE innovate_dev_db;

INSERT INTO Major VALUES ("Computer Science");
INSERT INTO Major VALUES ("Computer Engineering");
INSERT INTO Major VALUES ("Mechanical Engineering");
INSERT INTO Major VALUES ("Aerospace Engineering");
INSERT INTO Major VALUES ("Fine Arts");
INSERT INTO Major VALUES ("Architecture");
INSERT INTO Major VALUES ("Physics");
INSERT INTO Major VALUES ("Buisness");

INSERT INTO Student VALUES ("buraj_card_id", "buraj", "bingireddy", "Computer Science", "burajbingireddy@knights.ucf.edu", 0.0, 0.0, null);

INSERT INTO Student VALUES ("1234567", "Mary", "Smith", "Computer Science", "mary.smith@ucf.edu", 0.0, 0.0, null);
INSERT INTO Student VALUES ("1234568", "John", "Diaz", "Computer Science", "john.diaz@knights.ucf.edu", 0.0, 0.0, null);
INSERT INTO Student VALUES ("1234569", "Josh", "Gonzalez", "Fine Arts", "j.g@ucf.edu", 0.0, 0.0, null);
INSERT INTO Student VALUES ("1234570", "John", "Williams", "Fine Arts", "john.williams@ucf.edu", 0.0, 0.0, null);
INSERT INTO Student VALUES ("1234571", "Joe", "Jones", "Physics", "joe.johns@ucf.edu", 0.0, 0.0, null);
INSERT INTO Student VALUES ("1234572", "Alice", "Davis", "Computer Science", "a.davis@ucf.edu", 0.0, 0.0, null);
INSERT INTO Student VALUES ("1234573", "Bill", "Brown", "Aerospace Engineering", "billbrown@ucf.edu", 0.0, 0.0, null);
INSERT INTO Student VALUES ("1234574", "Bell", "Miller", "Physics", "bellmiller88@ucf.edu", 0.0, 0.0, null);
INSERT INTO Student VALUES ("1234575", "Katy", "Johnson", "Computer Engineering", "k.johnson@ucf.edu", 0.0, 0.0, null);

INSERT INTO Lab_Status VALUES ("buraj_card_id", "2000-06-15", "2000-06-15 09:15:00", null);

INSERT INTO Lab_Status VALUES ("1234567", CURDATE(), NOW(), null);
INSERT INTO Lab_Status VALUES ("1234568", CURDATE(), NOW(), null);
INSERT INTO Lab_Status VALUES ("1234569", CURDATE(), NOW(), null);
INSERT INTO Lab_Status VALUES ("1234570", CURDATE(), NOW(), null);
INSERT INTO Lab_Status VALUES ("1234571", CURDATE(), NOW(), null);
INSERT INTO Lab_Status VALUES ("1234572", CURDATE(), NOW(), null);
INSERT INTO Lab_Status VALUES ("1234573", CURDATE(), NOW(), null);
INSERT INTO Lab_Status VALUES ("1234574", CURDATE(), NOW(), null);


INSERT INTO Club VALUES ("P O O P B O I S");
INSERT INTO Club VALUES ("ASME");
INSERT INTO Club VALUES ("AIAA");
INSERT INTO Club VALUES ("Senior Design Aerospace");
INSERT INTO Club VALUES ("Robotics Club");


INSERT INTO Student_Club VALUES ("buraj_card_id", "P O O P B O I S");
INSERT INTO Student_Club VALUES ("buraj_card_id", "ASME");
INSERT INTO Student_Club VALUES ("buraj_card_id", "AIAA");
INSERT INTO Student_Club VALUES ("buraj_card_id", "Senior Design Aerospace");
INSERT INTO Student_Club VALUES ("buraj_card_id", "Robotics Club");

INSERT INTO Student_Club VALUES ("1234567", "ASME");
INSERT INTO Student_Club VALUES ("1234567", "AIAA");


INSERT INTO Lab_Tech VALUES ("suraj_tech_id", "suraj singireddy", "he's brown");
INSERT INTO Lab_Tech VALUES ("1", "Josh Hess", "he's smart");
INSERT INTO Lab_Tech VALUES ("2", "Olesya Nako", "she's busy");
INSERT INTO Lab_Tech VALUES ("3", "Lex Williams", "he's cool");
INSERT INTO Lab_Tech VALUES ("4", "Elizabeth James" ,"she's nice");


INSERT INTO Lab_Inventory VALUES (null, "item", "this is a cool item", 1, TRUE, TRUE);
INSERT INTO Lab_Inventory VALUES (null, "item2", "this is a cool item + 1", 2, TRUE, TRUE);
INSERT INTO Lab_Inventory VALUES (null, "item3", "this is a cool item + 2", 3, TRUE, TRUE);
INSERT INTO Lab_Inventory VALUES (null, "item4", "this is a cool item + 3", 4, TRUE, TRUE);
INSERT INTO Lab_Inventory VALUES (null, "item5", "this is a cool item + 4", 5, TRUE, TRUE);
INSERT INTO Lab_Inventory VALUES (null, "item6", "this is a cool item + 5", 6, TRUE, TRUE);
INSERT INTO Lab_Inventory VALUES (null, "item7", "this is a cool item + 6", 7, TRUE, TRUE);

INSERT INTO Lab_Inventory VALUES (null, "item8", "this is a cool item + 7", 4, FALSE, TRUE);
INSERT INTO Lab_Inventory VALUES (null, "item9", "this is a cool item + 8", 5, FALSE, TRUE);
INSERT INTO Lab_Inventory VALUES (null, "item10", "this is a cool item + 9", 6, TRUE, FALSE);
INSERT INTO Lab_Inventory VALUES (null, "item11", "this is a cool item + 10", 7, TRUE, FALSE);

INSERT INTO Lab_Inventory VALUES (null, "item12", "this is a cool item + 7", 4, FALSE, FALSE);
INSERT INTO Lab_Inventory VALUES (null, "item13", "this is a cool item + 8", 5, FALSE, FALSE);
INSERT INTO Lab_Inventory VALUES (null, "item14", "this is a cool item + 9", 6, FALSE, FALSE);
INSERT INTO Lab_Inventory VALUES (null, "item15", "this is a cool item + 10", 7, FALSE, FALSE);


INSERT INTO Laser_Appointment VALUES ("buraj_card_id", "suraj_tech_id", "2018-11-19", "2018-11-19 22:07:36", "23:59:00");

INSERT INTO Laser_Appointment VALUES ("1234567", "1", "2018-11-19", "2018-11-19 22:07:37", "00:59:00");
INSERT INTO Laser_Appointment VALUES ("1234569", "1", "2018-11-19", "2018-11-19 22:07:38", "00:35:00");
INSERT INTO Laser_Appointment VALUES ("1234570", "1", "2018-11-19", "2018-11-19 22:07:39", "00:45:00");
INSERT INTO Laser_Appointment VALUES ("1234572", "2", "2018-11-19", "2018-11-19 22:07:40", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234574", "2", "2018-11-19", "2018-11-19 22:07:41", "00:10:00");
INSERT INTO Laser_Appointment VALUES ("1234575", "2", "2018-11-19", "2018-11-19 22:07:41", "01:15:00");
INSERT INTO Laser_Appointment VALUES ("1234574", "3", "2018-11-19", "2018-11-19 22:07:43", "00:35:00");

INSERT INTO Laser_Appointment VALUES ("buraj_card_id", "suraj_tech_id", "2018-11-20", "2018-11-20 22:07:36", "23:59:00");
INSERT INTO Laser_Appointment VALUES ("1234567", "1", "2018-11-20", "2018-11-20 22:07:36", "00:59:00");
INSERT INTO Laser_Appointment VALUES ("1234569", "1", "2018-11-20", "2018-11-20 22:07:36", "00:59:00");
INSERT INTO Laser_Appointment VALUES ("1234570", "1", "2018-11-20", "2018-11-20 22:07:36", "01:59:00");
INSERT INTO Laser_Appointment VALUES ("1234572", "2", "2018-11-20", "2018-11-20 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234574", "2", "2018-11-20", "2018-11-20 22:07:36", "00:35:00");
INSERT INTO Laser_Appointment VALUES ("1234575", "2", "2018-11-20", "2018-11-20 22:07:36", "00:45:00");
INSERT INTO Laser_Appointment VALUES ("1234574", "3", "2018-11-20", "2018-11-20 22:07:36", "00:15:00");


INSERT INTO Laser_Appointment VALUES ("buraj_card_id", "suraj_tech_id", "2018-11-21", "2018-11-21 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234567", "1", "2018-11-21", "2018-11-21 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234569", "1", "2018-11-21", "2018-11-21 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234570", "1", "2018-11-21", "2018-11-21 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234572", "2", "2018-11-21", "2018-11-21 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234574", "2", "2018-11-21", "2018-11-21 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234575", "2", "2018-11-21", "2018-11-21 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234574", "3", "2018-11-21", "2018-11-21 22:07:36", "00:15:00");

INSERT INTO Laser_Appointment VALUES ("buraj_card_id", "suraj_tech_id", "2018-11-22", "2018-11-22 22:07:36", "23:59:00");
INSERT INTO Laser_Appointment VALUES ("1234567", "1", "2018-11-22", "2018-11-22 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234569", "1", "2018-11-22", "2018-11-22 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234570", "1", "2018-11-22", "2018-11-22 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234572", "2", "2018-11-22", "2018-11-22 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234574", "2", "2018-11-22", "2018-11-22 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234575", "2", "2018-11-22", "2018-11-22 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234574", "3", "2018-11-22", "2018-11-22 22:07:36", "00:15:00");

INSERT INTO Laser_Appointment VALUES ("buraj_card_id", "suraj_tech_id", "2018-11-23", "2018-11-23 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234567", "1", "2018-11-23", "2018-11-23 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234569", "1", "2018-11-23", "2018-11-23 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234570", "1", "2018-11-23", "2018-11-23 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234572", "2", "2018-11-23", "2018-11-23 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234574", "2", "2018-11-23", "2018-11-23 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234575", "2", "2018-11-23", "2018-11-23 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234574", "3", "2018-11-23", "2018-11-23 22:07:36", "00:15:00");

INSERT INTO Laser_Appointment VALUES ("buraj_card_id", "suraj_tech_id", "2018-11-24 22:07:36", "23:59:00");
INSERT INTO Laser_Appointment VALUES ("1234567", "1", "2018-11-24", "2018-11-24 22:07:36", "00:25:00");
INSERT INTO Laser_Appointment VALUES ("1234569", "1", "2018-11-24", "2018-11-24 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234570", "1", "2018-11-24", "2018-11-24 22:07:36", "00:10:00");
INSERT INTO Laser_Appointment VALUES ("1234572", "2", "2018-11-24", "2018-11-24 22:07:36", "00:30:00");
INSERT INTO Laser_Appointment VALUES ("1234574", "2", "2018-11-24", "2018-11-24 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234575", "2", "2018-11-24", "2018-11-24 22:07:36", "00:15:00");
INSERT INTO Laser_Appointment VALUES ("1234574", "3", "2018-11-24", "2018-11-24 22:07:36", "00:59:00");



INSERT INTO Rented_Inventory VALUES ("buraj_card_id", 1, "2019-01-01 00:00:00", null, FALSE);


INSERT INTO Session VALUES ("suraj_tech_id", "2000-06-15 09:15:00");

INSERT INTO FAQ VALUES (null, "Is this a question?", "no");

INSERT INTO FAQ VALUES (null, "Is the lab open on sundays?", "No.");

INSERT INTO FAQ VALUES (null, "Are you open game days", "We are typically not open on game days. Always ask to make sure.");

INSERT INTO FAQ VALUES (null, "Do you guys supply material?", "No, we do not. Everyone brings their own materials.");


INSERT INTO Lab_Hours VALUES ("00:00:00", "18:00:00", "00:00:00", "18:00:00", "00:00:00", "18:00:00", "00:00:00", "18:00:00", "00:00:00", "18:00:00", "00:00:00", "18:00:00", "00:00:00", "18:00:00");


INSERT INTO Appointment_Hours VALUES ("18:00:00", "22:00:00", "18:00:00", "22:00:00", "18:00:00", "22:00:00", "18:00:00", "22:00:00", "18:00:00", "22:00:00", "18:00:00", "22:00:00", "18:00:00", "22:00:00");

INSERT INTO Machine VALUES (null, "machine_name", "machine_type", "has some restrictions", "1970-01-01 00:00:00", null);

INSERT INTO 3DPrint_Queue VALUES (null, 1, "buraj_card_id", "suraj_tech_id", CURDATE(), NOW(), "02:00:00", "Waiting", "part_name", "path/to/file.txt", 1.0, 1.0, "coolstuff", "coolstuff2", "P O O P B O I S");

INSERT INTO Laser_Queue VALUES (null, 1, "buraj_card_id", "suraj_tech_id", CURDATE(), NOW(), "01:20:00", "Waiting");
INSERT INTO Laser_Queue VALUES (null, 1, "a", "suraj_tech_id", CURDATE(), NOW(), "00:30:05", "Waiting");
INSERT INTO Laser_Queue VALUES (null, 1, "buraj_card_id", "suraj_tech_id", CURDATE(), NOW(), "00:40:00", "Waiting");

INSERT INTO Laser_Queue VALUES (null, 1, "1234567", "suraj_tech_id", CURDATE(), NOW(), "01:20:00", "Waiting");
INSERT INTO Laser_Queue VALUES (null, 1, "1234568", "1", CURDATE(), NOW(), "00:30:05", "Waiting");
INSERT INTO Laser_Queue VALUES (null, 1, "1234569", "2", CURDATE(), NOW(), "00:40:00", "Waiting");
INSERT INTO Laser_Queue VALUES (null, 1, "1234570", "3", CURDATE(), NOW(), "01:20:00", "Waiting");
INSERT INTO Laser_Queue VALUES (null, 1, "1234571", "3", CURDATE(), NOW(), "00:30:05", "Waiting");
INSERT INTO Laser_Queue VALUES (null, 1, "1234572", "2", CURDATE(), NOW(), "00:40:00", "Waiting");



INSERT INTO 3DMaterial VALUES ("coolstuff", 5.0, CURDATE(), 3);
INSERT INTO 3DMaterial VALUES ("coolstuff2", 6.0, CURDATE(), 2);
INSERT INTO 3DMaterial Values ("ABS - Blue", 5.0, CURDATE(), 3);
INSERT INTO 3DMaterial Values ("ABS - Green", 5.0, CURDATE(), 3);
INSERT INTO 3DMaterial Values ("PLA", 5.0, CURDATE(), 3);



INSERT INTO 3DMaterial_Graph VALUES ("coolstuff", CURDATE(), 2.0);
INSERT INTO 3DMaterial_Graph VALUES ("coolstuff2", CURDATE(), 4.0);

INSERT INTO Message VALUES (null, "message1", "You have entered the 3 hour wait for the laser cutter");
INSERT INTO Message VALUES (null, "message2", "You have entered the 1 hour wait for the laser cutter");
INSERT INTO Message VALUES (null, "message3", "You are next, please come to the innovation lab.");
INSERT INTO Message VALUES (null, "message4", "You have been deleted from the Laser Queue");

INSERT INTO Notification VALUES ("buraj_card_id", 1, NOW(), false);
INSERT INTO Notification VALUES ("buraj_card_id", 2, NOW(), false);
INSERT INTO Notification VALUES ("buraj_card_id", 3, NOW(), false);
INSERT INTO Notification VALUES ("buraj_card_id", 4, NOW(), false);


INSERT INTO Notification VALUES ("1234567", 1, NOW(), false);
INSERT INTO Notification VALUES ("1234567", 4, NOW(), false);
INSERT INTO Notification VALUES ("1234567", 1, NOW(), false);
INSERT INTO Notification VALUES ("1234567", 2, NOW(), false);
INSERT INTO Notification VALUES ("1234567", 3, NOW(), false);

INSERT INTO Laser_Configuration (material, tech_id, thickness, task, power, speed, ppi, notes) VALUES ( "acrylic ", "suraj_tech_id", 0.22, "cut" , 100, 1, 1000, "keep an eye out" );
