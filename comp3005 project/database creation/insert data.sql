


INSERT INTO users (first_name, last_name, email, pass, height, mass) VALUES
('John', 'Smith', 'john.smith@gmail.com', 'abcd', '6','160'),
('Kelly', 'Doe', 'kelly.doe@gmail.com', '1234','5.5','130');

INSERT INTO fitness_achievements (user_id, achieved_on, achievement_name) VALUES
(1, '2024-01-01', 'ran a kilometer in 5:30'),
(1, '2024-02-01', 'ran a kilometer in 4:30'),
(1, '2024-03-01', 'ran a kilometer in 4:00'),
(2, '2024-03-01', 'benched 30kg'),
(2, '2024-03-01', 'benched 50kg'),
(2, '2024-03-01', 'benched 70kg');

INSERT INTO exercise_routines (user_id, number_of_times, exercise_name) VALUES
(1, 10, 'laps around the building'),
(1, 20, 'leg presses'),
(2, 20, 'curl 5kg'),
(2, 10, 'curl 10kg');

INSERT INTO fitness_goals (user_id, achieve_by, goal_weight) VALUES
(1, '2024-01-01', 180),
(1, '2024-02-01', 170),
(1, '2024-03-01', 160),
(2, '2024-01-01', 140),
(2, '2024-02-01', 135),
(2, '2024-03-01', 130);

INSERT INTO trainers (first_name, last_name, email, pass, start_time, end_time) VALUES
('Fred', 'Jones', 'fred.jones@gmail.com', 'efgh', 8, 16),
('Linda', 'Clark', 'linda.clark@gmail.com', '5678', 6, 14);


INSERT INTO scheduled_sessions (user_id, trainer_id, session_date, session_name, start_time, end_time, paid_for) VALUES
(1,1,'2024-01-10', 'leg strength training', 8, 10, 1),
(1,2,'2024-01-20', 'endurance', 10, 12, 1),
(1,1,'2024-01-30', 'more leg strength training', 12, 14, 0),
(2,2,'2024-01-11', 'benchpress form', 9, 10, 1),
(2,1,'2024-01-21', 'biceps', 10, 11, 1),
(2,2,'2024-01-31', 'curling', 12, 14, 0);


INSERT INTO admins (first_name, last_name, email, pass) VALUES
('James', 'Taylor', 'james.taylor@gmail.com', '9101112'),
('Margeret', 'Williams', 'margeret.williams@gmail.com', 'ijkl');


INSERT INTO classes (trainer_id, room_number, topic, class_date, start_time, end_time) VALUES
(1, 101, 'yoga', '2024-01-12', 8, 10),
(1, 101, 'cycling', '2024-01-22', 8, 10),
(2, 102, 'fitness', '2024-01-13', 8, 10),
(2, 103, 'meditation', '2024-01-23', 8, 10);


INSERT INTO class_participants (class_id, user_id, paid_for) VALUES
(1,1,1),
(1,2,1),
(2,1,1),
(3,1,0);


INSERT INTO equipment (equipment_name, last_serviced) VALUES
('treadmills', '2024-01-01'),
('leg press machine', '2023-10-05'),
('bench press weights', '2023-11-17'),
('dumbbells', '2023-08-3');