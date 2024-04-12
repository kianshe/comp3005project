CREATE TABLE users (
    user_id SERIAL,
    first_name VARCHAR,
	last_name VARCHAR,
	email TEXT NOT NULL UNIQUE,
    pass VARCHAR,
    height VARCHAR,
    mass VARCHAR,

    PRIMARY KEY (user_id)
);


CREATE TABLE fitness_achievements (
    achievement_id SERIAL,
    user_id INT,
    achieved_on DATE,
    achievement_name VARCHAR,

    PRIMARY KEY (achievement_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE exercise_routines (
    exercise_id SERIAL,
    user_id INT,
    number_of_times INT,
    exercise_name VARCHAR,

    PRIMARY KEY (exercise_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE fitness_goals (
    goal_id SERIAL,
    user_id INT,
    achieve_by DATE,
    goal_weight INT,

    PRIMARY KEY (goal_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE trainers (
    trainer_id SERIAL,
    first_name VARCHAR,
	last_name VARCHAR,
	email TEXT NOT NULL UNIQUE,
    pass VARCHAR,
    start_time INT,
    end_time INT,

    PRIMARY KEY (trainer_id)
);

CREATE TABLE scheduled_sessions (
    session_id SERIAL,
    user_id INT,
    trainer_id INT,
    session_date DATE,
    session_name VARCHAR,
    start_time INT,
    end_time INT,
    paid_for INT,

    PRIMARY KEY (session_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (trainer_id) REFERENCES trainers(trainer_id)
);

CREATE TABLE admins (
    admin_id SERIAL,
    first_name VARCHAR,
	last_name VARCHAR,
	email TEXT NOT NULL UNIQUE,
    pass VARCHAR,

    PRIMARY KEY (admin_id)
);

CREATE TABLE classes (
    class_id SERIAL,
    trainer_id INT,
	room_number INT,
    topic VARCHAR,
    class_date DATE,
    start_time INT,
    end_time INT,

    PRIMARY KEY (class_id)
);

CREATE TABLE class_participants (
    class_id INT,
    user_id INT,
    paid_for INT,

    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE equipment (
    equipment_id SERIAL,
    equipment_name VARCHAR,
	last_serviced DATE,

    PRIMARY KEY (equipment_id)
)