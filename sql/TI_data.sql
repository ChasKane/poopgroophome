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
INSERT INTO Student VALUES ("1234567", "buraj", "bingireddy", "Computer Science", "burajbingireddy@knights.ucf.edu", 0.0, 0.0, null);
INSERT INTO Student VALUES ("1234568", "buraj", "bingireddy", "Computer Science", "burajbingireddy@knights.ucf.edu", 0.0, 0.0, null);
INSERT INTO Student VALUES ("1234569", "buraj", "bingireddy", "Computer Science", "burajbingireddy@knights.ucf.edu", 0.0, 0.0, null);
INSERT INTO Student VALUES ("1234570", "buraj", "bingireddy", "Computer Science", "burajbingireddy@knights.ucf.edu", 0.0, 0.0, null);
INSERT INTO Student VALUES ("1234571", "buraj", "bingireddy", "Computer Science", "burajbingireddy@knights.ucf.edu", 0.0, 0.0, null);
INSERT INTO Student VALUES ("1234572", "buraj", "bingireddy", "Computer Science", "burajbingireddy@knights.ucf.edu", 0.0, 0.0, null);
INSERT INTO Student VALUES ("1234573", "buraj", "bingireddy", "Computer Science", "burajbingireddy@knights.ucf.edu", 0.0, 0.0, null);
INSERT INTO Student VALUES ("1234574", "buraj", "bingireddy", "Computer Science", "burajbingireddy@knights.ucf.edu", 0.0, 0.0, null);
INSERT INTO Student VALUES ("1234575", "buraj", "bingireddy", "Computer Science", "burajbingireddy@knights.ucf.edu", 0.0, 0.0, null);

INSERT INTO Lab_Status VALUES ("buraj_card_id", "2000-06-15", "2000-06-15 09:15:00", null);
INSERT INTO Lab_Status VALUES ("a", CURDATE(), NOW(), null);

INSERT INTO Club VALUES ("P O O P B O I S");

INSERT INTO Student_Club VALUES ("buraj_card_id", "P O O P B O I S");

INSERT INTO Lab_Tech VALUES ("suraj_tech_id", "suraj singireddy", "he's brown");

INSERT INTO Tech_Schedule VALUES ("suraj_tech_id", 0, "00:00:00", "23:59:59");

INSERT INTO Lab_Inventory VALUES (null, "item", "this is a cool item", 1, TRUE, TRUE);

INSERT INTO Laser_Appointment VALUES ("buraj_card_id", "suraj_tech_id", "2000-06-15", "00:00:00", "23:59:00");

INSERT INTO Rented_Inventory VALUES ("buraj_card_id", 1, "2019-01-01 00:00:00", null, FALSE);

INSERT INTO Session VALUES ("suraj_tech_id", "2000-06-15 09:15:00");

INSERT INTO FAQ VALUES (null, "is this a question?", "no");

INSERT INTO FAQ VALUES (null, "Is the lab open on sundays?", "No.");

INSERT INTO FAQ VALUES (null, "Are you open game days", "We are typically not open on game days. Always ask to make sure.");

INSERT INTO FAQ VALUES (null, "Do you guys supply material?", "No, we do not. Everyone brings their own materials.");

INSERT INTO Lab_Hours VALUES ("00:00:00", "18:00:00", "00:00:00", "18:00:00", "00:00:00", "18:00:00", "00:00:00", "18:00:00", "00:00:00", "18:00:00", "00:00:00", "18:00:00", "00:00:00", "18:00:00");

INSERT INTO Appointment_Hours VALUES ("18:00:00", "22:00:00", "18:00:00", "22:00:00", "18:00:00", "22:00:00", "18:00:00", "22:00:00", "18:00:00", "22:00:00", "18:00:00", "22:00:00", "18:00:00", "22:00:00");

INSERT INTO Machine VALUES (null, "machine_name", "machine_type", "has some restrictions", "1970-01-01 00:00:00", "Working");

INSERT INTO 3DPrint_Queue VALUES (null, 1, "buraj_card_id", "suraj_tech_id", CURDATE(), NOW(), "02:00:00", "Waiting", "part_name", "path/to/file.txt", 1.0, 1.0, "coolstuff", "coolstuff2", "P O O P B O I S");

INSERT INTO Laser_Queue VALUES (null, 1, "buraj_card_id", "suraj_tech_id", CURDATE(), NOW(), "01:20:00", "Waiting");
INSERT INTO Laser_Queue VALUES (null, 1, "a", "suraj_tech_id", CURDATE(), NOW(), "00:30:05", "Waiting");
INSERT INTO Laser_Queue VALUES (null, 1, "buraj_card_id", "suraj_tech_id", CURDATE(), NOW(), "00:40:00", "Waiting");

INSERT INTO 3DMaterial VALUES ("coolstuff", 5.0, CURDATE(), 3);
INSERT INTO 3DMaterial VALUES ("coolstuff2", 6.0, CURDATE(), 2);

INSERT INTO 3DMaterial_Graph VALUES ("coolstuff", CURDATE(), 2.0);
INSERT INTO 3DMaterial_Graph VALUES ("coolstuff2", CURDATE(), 4.0);

INSERT INTO Message VALUES (null, "message1", "is this a message?");
INSERT INTO Message VALUES (null, "message2", "it cannot be a message");
INSERT INTO Message VALUES (null, "message3", "it is a message");
INSERT INTO Message VALUES (null, "message4", "'message', a haiku by message");

INSERT INTO Notification VALUES ("buraj_card_id", 1, NOW(), false);
INSERT INTO Notification VALUES ("buraj_card_id", 2, NOW(), false);
INSERT INTO Notification VALUES ("buraj_card_id", 3, NOW(), false);
INSERT INTO Notification VALUES ("buraj_card_id", 4, NOW(), false);
INSERT INTO Notification VALUES ("a", 1, NOW(), false);
INSERT INTO Notification VALUES ("a", 2, NOW(), false);
INSERT INTO Notification VALUES ("a", 3, NOW(), false);
INSERT INTO Notification VALUES ("a", 4, NOW(), false);

INSERT INTO Laser_Configuration (material, tech_id, thickness, task, power, speed, ppi, notes) VALUES ( "acrylic ", "suraj_tech_id", 0.22, "cut" , 100, 1, 1000, "keep an eye out" );
