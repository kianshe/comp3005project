const { Client } = require("pg");

const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
app.use(bodyParser.json());

app.set("view engine", "html");

app.engine("html", require("ejs").renderFile);
app.set("view options", {
  layout: false,
});

const client = new Client({
  user: "postgres",
  password: "password",
  host: "localhost",
  port: "5432",
  database: "finalproject",
});

client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err);
  });

var signedIn = 0;
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/client.js", (req, res) => {
  res.sendFile(path.join(__dirname, "/client.js"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/home.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/login.html"));
});

app.get("/register.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/register.html"));
});

app.get("/users/:userId", upload.array(), (req, res) => {
  const userId = parseInt(req.params.userId);
  let sendUsers = [];
  let sendTrainers = [];
  let sendSessions = [];
  let sendGoals = [];
  let sendAchievements = [];
  let sendRoutines = [];
  let sendClasses = [];
  let sendParticipation = [];

  client.query(
    "SELECT * from users WHERE user_id=($1)",
    [userId],
    (err, result) => {
      if (err) {
        res.render(path.join(__dirname, "/views/notsigned.ejs"));
      } else {
        sendUsers = result.rows;
        client.query(
          "SELECT * from fitness_goals WHERE user_id=($1)",
          [userId],
          (err, result) => {
            if (err) {
              console.error("Error executing query", err);
            } else {
              client.query(
                "SELECT * from fitness_achievements WHERE user_id=($1)",
                [userId],
                (err, result) => {
                  if (err) {
                    console.error("Error executing query", err);
                  } else {
                    sendAchievements = result.rows;
                    client.query(
                      "SELECT * from exercise_routines WHERE user_id=($1)",
                      [userId],
                      (err, result) => {
                        if (err) {
                          console.error("Error executing query", err);
                        } else {
                          sendRoutines = result.rows;
                          client.query(
                            "SELECT * from classes",
                            (err, result) => {
                              if (err) {
                                console.error("Error executing query", err);
                              } else {
                                sendClasses = result.rows;
                                client.query(
                                  "SELECT * from class_participants WHERE user_id=($1)",
                                  [userId],
                                  (err, result) => {
                                    if (err) {
                                      console.error(
                                        "Error executing query",
                                        err
                                      );
                                    } else {
                                      sendParticipation = result.rows;
                                      client.query(
                                        "SELECT * from trainers",
                                        (err, result) => {
                                          if (err) {
                                          } else {
                                            sendTrainers = result.rows;
                                            client.query(
                                              "SELECT * from scheduled_sessions WHERE user_id=($1)",
                                              [userId],
                                              (err, result) => {
                                                if (err) {
                                                } else {
                                                  sendSessions = result.rows;
                                                  if (userId != 0) {
                                                    res.render(
                                                      path.join(
                                                        __dirname,
                                                        "/views/dashboard.ejs"
                                                      ),
                                                      {
                                                        user: sendUsers,
                                                        trainers: sendTrainers,
                                                        sessions: sendSessions,
                                                        goals: sendGoals,
                                                        achievements:
                                                          sendAchievements,
                                                        routines: sendRoutines,
                                                        classes: sendClasses,
                                                        enrollment:
                                                          sendParticipation,
                                                      }
                                                    );
                                                  } else {
                                                    res.render(
                                                      path.join(
                                                        __dirname,
                                                        "/views/notsigned.ejs"
                                                      ),
                                                      {}
                                                    );
                                                  }
                                                }
                                              }
                                            );
                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.post("/adminRemoveUser", upload.array(), (req, res) => {
  const which = req.body.which;
  const classId = req.body.class;
  const userId = req.body.user;

  if (which === "session") {
    client.query(
      "SELECT * from scheduled_sessions WHERE user_id=($1) and session_id=($2)",
      [userId, classId],
      function (err, result) {
        if (err) {
          console.log(err);
          res.json(false);
        } else {
          if (result.rows[0].paid_for === 0) {
            client.query(
              "DELETE from scheduled_sessions WHERE user_id=($1) and session_id=($2)",
              [userId, classId],
              function (err, result) {
                if (err) {
                  console.log(err);
                  res.json(false);
                } else {
                  res.json(true);
                }
              }
            );
          } else {
            res.json(false);
          }
        }
      }
    );
  } else if (which === "class") {
    client.query(
      "SELECT * from class_participants WHERE user_id=($1) and class_id=($2)",
      [userId, classId],
      function (err, result) {
        if (err) {
          console.log(err);
          res.json(false);
        } else {
          if (result.rows[0].paid_for === 0) {
            client.query(
              "DELETE from class_participants WHERE user_id=($1) and class_id=($2)",
              [userId, classId],
              function (err, result) {
                if (err) {
                  console.log(err);
                  res.json(false);
                } else {
                  res.json(true);
                }
              }
            );
          } else {
            res.json(false);
          }
        }
      }
    );
  }
});

app.post("/service", upload.array(), (req, res) => {
  const id = req.body.id;
  const date = req.body.date;
  client.query(
    "UPDATE equipment SET last_serviced = ($1) WHERE equipment_id=($2)",
    [date, id],
    function (err, result) {
      if (err) {
        console.log(err);
        res.json(false);
      } else {
        res.json(true);
      }
    }
  );
});

app.post("/removeRoutine", upload.array(), (req, res) => {
  const id = req.body.id;
  client.query(
    "DELETE FROM exercise_routines WHERE exercise_id = ($1)",
    [id],
    function (err, result) {
      if (err) {
        console.log(err);
        res.json(false);
      } else {
        res.json(true);
      }
    }
  );
});

app.post("/addRoutine", upload.array(), (req, res) => {
  const name = req.body.name;
  const reps = req.body.reps;

  client.query(
    "INSERT into exercise_routines (exercise_name, number_of_times, user_id) VALUES($1, $2, $3) RETURNING *",
    [name, reps, signedIn.slice(1)],
    function (err, result) {
      if (err) {
        console.log(err);
        res.json(false);
      } else {
        res.json(true);
      }
    }
  );
});

app.post("/addAchievement", upload.array(), (req, res) => {
  const name = req.body.name;
  const date = req.body.date;

  client.query(
    "INSERT into fitness_achievements (achievement_name, achieved_on, user_id) VALUES($1, $2, $3) RETURNING *",
    [name, date, signedIn.slice(1)],
    function (err, result) {
      if (err) {
        console.log(err);
        res.json(false);
      } else {
        res.json(true);
      }
    }
  );
});

app.post("/addEquipment", upload.array(), (req, res) => {
  const name = req.body.name;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = yyyy + "/" + mm + "/" + dd;
  client.query(
    "INSERT into equipment (equipment_name, last_serviced) VALUES($1, $2) RETURNING *",
    [name, today],
    function (err, result) {
      if (err) {
        console.log(err);
        res.json(false);
      } else {
        res.json(true);
      }
    }
  );
});

app.post("/removeEquipment", upload.array(), (req, res) => {
  const id = req.body.id;
  client.query(
    "DELETE FROM equipment WHERE equipment_id = ($1)",
    [id],
    function (err, result) {
      if (err) {
        console.log(err);
        res.json(false);
      } else {
        res.json(true);
      }
    }
  );
});

app.post("/pay", upload.array(), (req, res) => {
  const typ = req.body.typ;
  const id = req.body.id;

  if (typ === "class") {
    client.query(
      "UPDATE class_participants SET paid_for = ($1) WHERE user_id=($2) AND class_id=($3)",
      [1, signedIn.slice(1), id],
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(true);
        }
      }
    );
  } else if (typ === "session") {
    client.query(
      "UPDATE scheduled_sessions SET paid_for = ($1) WHERE user_id=($2) AND session_id=($3)",
      [1, signedIn.slice(1), id],
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(true);
        }
      }
    );
  }
});

app.post("/setTimes", upload.array(), (req, res) => {
  const start = req.body.start;
  const end = req.body.end;
  const id = req.body.id;
  client.query(
    "UPDATE trainers SET start_time = ($1), end_time = ($2) WHERE trainer_id=($3)",
    [start, end, id],
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(true);
      }
    }
  );
});

app.post("/updateweight", upload.array(), (req, res) => {
  const weight = req.body.new;
  client.query(
    "UPDATE users SET mass = ($1) WHERE user_id=($2)",
    [weight, signedIn.slice(1)],
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(true);
      }
    }
  );
});

app.post("/addclass", upload.array(), (req, res) => {
  const topic = req.body.topic;
  const date = req.body.date;
  const id = req.body.id;
  const room = req.body.room;
  const start = req.body.start;
  const end = req.body.end;

  let bad = false;

  client.query(
    "SELECT * from classes WHERE class_date = ($1) AND room_number = ($2)",
    [date, room],
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        if (result.rows.length === 0) {
        } else {
          for (let i = 0; i < result.rows.length; i++) {
            if (
              start < result.rows[i].start_time &&
              end > result.rows[i].start_time
            ) {
              bad = true;
            }
            if (
              start > result.rows[i].start_time &&
              end < result.rows[i].end_time
            ) {
              bad = true;
            }
            if (
              start < result.rows[i].end_time &&
              end > result.rows[i].end_time
            ) {
              bad = true;
            }
            if (
              parseInt(start) === parseInt(result.rows[i].start_time) ||
              parseInt(end) === parseInt(result.rows[i].end_time)
            ) {
              bad = true;
            }
          }
        }
        client.query(
          "SELECT * from scheduled_sessions WHERE session_date = ($1) AND trainer_id = ($2)",
          [date, id],
          function (err, result) {
            if (err) {
            } else {
              if (result.rows.length === 0) {
              } else {
                for (let i = 0; i < result.rows.length; i++) {
                  if (
                    start < result.rows[i].start_time &&
                    end > result.rows[i].start_time
                  ) {
                    bad = true;
                  }
                  if (
                    start > result.rows[i].start_time &&
                    end < result.rows[i].end_time
                  ) {
                    bad = true;
                  }
                  if (
                    start < result.rows[i].end_time &&
                    end > result.rows[i].end_time
                  ) {
                    bad = true;
                  }
                  if (
                    parseInt(start) === parseInt(result.rows[i].start_time) ||
                    parseInt(end) === parseInt(result.rows[i].end_time)
                  ) {
                    bad = true;
                  }
                }
              }

              client.query(
                "SELECT * from trainers WHERE trainer_id = ($1)",
                [id],
                function (err, result) {
                  if (err) {
                  } else {
                    if (
                      start < result.rows[0].start_time ||
                      end > result.rows[0].end_time
                    ) {
                      bad = true;
                    }
                    if (bad === false) {
                      client.query(
                        "INSERT into classes (trainer_id, room_number, topic, class_date, start_time, end_time) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
                        [id, room, topic, date, start, end],
                        function (err, result) {
                          if (err) {
                          } else {
                            res.json(true);
                          }
                        }
                      );
                    } else {
                      res.json(false);
                    }
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.post("/enrollclass", upload.array(), (req, res) => {
  const id = req.body.id;
  let theClass;
  let bad = false;

  client.query(
    "Select * from classes WHERE class_id=($1)",
    [id],
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        theClass = result.rows;
        let start = theClass.start_time;
        let end = theClass.end_time;
        client.query(
          "Select * from scheduled_sessions WHERE user_id=($1)",
          [signedIn.slice(1)],
          function (err, result) {
            if (err) {
              console.log(err);
            } else {
              for (let i = 0; i < result.rows.length; i++) {
                if (
                  start < result.rows[i].start_time &&
                  end > result.rows[i].start_time
                ) {
                  bad = true;
                }
                if (
                  start > result.rows[i].start_time &&
                  end < result.rows[i].end_time
                ) {
                  bad = true;
                }
                if (
                  start < result.rows[i].end_time &&
                  end > result.rows[i].end_time
                ) {
                  bad = true;
                }
                if (
                  start === result.rows[i].start_time &&
                  end === result.rows[i].end_time
                ) {
                  bad = true;
                }
              }
              client.query(
                "SELECT * FROM class_participants",
                function (err, result) {
                  if (err) {
                  } else {
                    for (let i = 0; i < result.rows.length; i++) {
                      if (
                        parseInt(result.rows[i].class_id) === parseInt(id) &&
                        parseInt(result.rows[i].user_id) ===
                          parseInt(signedIn.slice(1))
                      ) {
                        bad = true;
                      }
                    }
                    if (bad === false) {
                      client.query(
                        "INSERT into class_participants (user_id, class_id, paid_for) VALUES($1, $2, $3) RETURNING *",
                        [signedIn.slice(1), id, 0],
                        function (err, result) {
                          if (err) {
                            console.log(err);
                          } else {
                            res.json(true);
                          }
                        }
                      );
                    } else {
                      res.json(false);
                    }
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.post("/addgoal", upload.array(), (req, res) => {
  const weight = req.body.weight;
  const date = req.body.date;
  client.query(
    "INSERT into fitness_goals (user_id, achieve_by, goal_weight) VALUES($1, $2, $3) RETURNING *",
    [signedIn.slice(1), date, weight],
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(true);
      }
    }
  );
});

app.get("/dashboard", (req, res) => {
  if (signedIn === 0 || signedIn === "0") {
    res.render(path.join(__dirname, "/views/notsigned.ejs"));
  }

  if (signedIn[0] === "a") {
    let sendClasses = [];
    let sendTrainers = [];
    let sendAdmin = [];
    let sendSessions = [];
    let sendClassParticipation = [];
    let sendEquipment = [];

    client.query(
      "SELECT * from admins WHERE admin_id=($1)",
      [signedIn.slice(1)],
      (err, result) => {
        if (err) {
          res.render(path.join(__dirname, "/views/notsigned.ejs"));
        } else {
          sendAdmin = result.rows[0];
          client.query("SELECT * from classes", (err, result) => {
            if (err) {
            } else {
              sendClasses = result.rows;
              client.query("SELECT * from trainers", (err, result) => {
                if (err) {
                } else {
                  sendTrainers = result.rows;
                  client.query(
                    "SELECT * from scheduled_sessions",
                    (err, result) => {
                      if (err) {
                      } else {
                        sendSessions = result.rows;
                        client.query(
                          "SELECT * from class_participants",
                          (err, result) => {
                            if (err) {
                            } else {
                              sendClassParticipation = result.rows;
                              client.query(
                                "SELECT * from equipment",
                                (err, result) => {
                                  if (err) {
                                  } else {
                                    sendEquipment = result.rows;
                                    res.render(
                                      path.join(
                                        __dirname,
                                        "/views/admindashboard.ejs"
                                      ),
                                      {
                                        classes: sendClasses,
                                        trainers: sendTrainers,
                                        admin: sendAdmin,
                                        sessions: sendSessions,
                                        participants: sendClassParticipation,
                                        equipment: sendEquipment,
                                      }
                                    );
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              });
            }
          });
        }
      }
    );
  }

  if (signedIn[0] === "m") {
    let sendUsers = [];
    let sendTrainers = [];
    let sendSessions = [];
    let sendGoals = [];
    let sendClasses = [];
    let sendEnrollment = [];
    let sendRoutines = [];
    let sendAchievements = [];

    client.query(
      "SELECT * from users WHERE user_id=($1)",
      [signedIn.slice(1)],
      (err, result) => {
        if (err) {
          res.render(path.join(__dirname, "/views/notsigned.ejs"));
        } else {
          sendUsers = result.rows;
          client.query(
            "SELECT * from fitness_goals WHERE user_id=($1)",
            [signedIn.slice(1)],
            (err, result) => {
              if (err) {
                console.error("Error executing query", err);
              } else {
                sendGoals = result.rows;
              }
            }
          );
          client.query("SELECT * from classes", (err, result) => {
            if (err) {
              console.error("Error executing query", err);
            } else {
              sendClasses = result.rows;
            }
          });
          client.query("SELECT * from class_participants", (err, result) => {
            if (err) {
              console.error("Error executing query", err);
            } else {
              sendEnrollment = result.rows;
            }
          });

          client.query("SELECT * from trainers", (err, result) => {
            if (err) {
            } else {
              sendTrainers = result.rows;
              client.query(
                "SELECT * from scheduled_sessions WHERE user_id=($1)",
                [signedIn.slice(1)],
                (err, result) => {
                  if (err) {
                  } else {
                    sendSessions = result.rows;
                    client.query(
                      "SELECT * from fitness_achievements WHERE user_id=($1)",
                      [signedIn.slice(1)],
                      (err, result) => {
                        if (err) {
                        } else {
                          sendAchievements = result.rows;
                          client.query(
                            "SELECT * from exercise_routines WHERE user_id=($1)",
                            [signedIn.slice(1)],
                            (err, result) => {
                              if (err) {
                              } else {
                                sendRoutines = result.rows;
                                if (signedIn.slice(1) != 0) {
                                  res.render(
                                    path.join(
                                      __dirname,
                                      "/views/dashboard.ejs"
                                    ),
                                    {
                                      user: sendUsers,
                                      trainers: sendTrainers,
                                      sessions: sendSessions,
                                      goals: sendGoals,
                                      classes: sendClasses,
                                      enrollment: sendEnrollment,
                                      achievements: sendAchievements,
                                      routines: sendRoutines,
                                    }
                                  );
                                } else {
                                  res.render(
                                    path.join(
                                      __dirname,
                                      "/views/notsigned.ejs"
                                    ),
                                    {}
                                  );
                                }
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        }
      }
    );
  }
  if (signedIn[0] === "t") {
    let sendTrainer = [];
    let sendUsers = [];

    let sendSessions = [];
    let sendClasses = [];

    client.query("SELECT * from users ", (err, result) => {
      if (err) {
        res.render(path.join(__dirname, "/views/notsigned.ejs"));
      } else {
        sendUsers = result.rows;
        client.query(
          "SELECT * from trainers WHERE trainer_id=($1)",
          [signedIn.slice(1)],
          (err, result) => {
            if (err) {
              console.error("Error executing query", err);
            } else {
              sendTrainer = result.rows;
              client.query(
                "SELECT * from classes WHERE trainer_id=($1)",
                [signedIn.slice(1)],
                (err, result) => {
                  if (err) {
                    console.error("Error executing query", err);
                  } else {
                    sendClasses = result.rows;
                    client.query(
                      "SELECT * from scheduled_sessions WHERE trainer_id=($1)",
                      [signedIn.slice(1)],
                      (err, result) => {
                        if (err) {
                          console.error("Error executing query", err);
                        } else {
                          sendSessions = result.rows;
                          res.render(
                            path.join(__dirname, "/views/trainerdashboard.ejs"),
                            {
                              trainer: sendTrainer,
                              users: sendUsers,
                              classes: sendClasses,
                              sessions: sendSessions,
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    });
  }
});

app.post("/signin", upload.array(), (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const person = req.body.type;
  if (person === "member") {
    client.query(
      "SELECT * from users WHERE email=($1) AND pass=($2)",
      [email, password],
      (err, result) => {
        if (err) {
          console.error("Error executing query", err);
        } else {
          if (typeof result.rows[0] !== "undefined") {
            res.json(result.rows);
            signedIn = "m" + result.rows[0].user_id;
          } else {
            res.json(false);
          }
        }
      }
    );
  } else if (person === "trainer") {
    client.query(
      "SELECT * from trainers WHERE email=($1) AND pass=($2)",
      [email, password],
      (err, result) => {
        if (err) {
          console.error("Error executing query", err);
        } else {
          if (typeof result.rows[0] !== "undefined") {
            res.json(result.rows);
            signedIn = "t" + result.rows[0].trainer_id;
          } else {
            res.json(false);
          }
        }
      }
    );
  } else if (person === "admin") {
    client.query(
      "SELECT * from admins WHERE email=($1) AND pass=($2)",
      [email, password],
      (err, result) => {
        if (err) {
          console.error("Error executing query", err);
        } else {
          if (typeof result.rows[0] !== "undefined") {
            res.json(result.rows);
            signedIn = "a" + result.rows[0].admin_id;
          } else {
            res.json(false);
          }
        }
      }
    );
  }
});

app.post("/signout", upload.array(), (req, res) => {
  if (signedIn != 0) {
    signedIn = 0;
  } else {
  }
});

app.post("/rescheduleclass", upload.array(), (req, res) => {
  const day = req.body.date;
  const start = req.body.start;
  const end = req.body.end;
  const id = req.body.id;
  const room = req.body.room;
  let bad = false;
  let theSession;

  client.query(
    "SELECT * from classes WHERE class_id=($1)",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error executing query", err);
      } else {
        theSession = result.rows[0];
        client.query(
          "SELECT * from trainers WHERE trainer_id = ($1)",
          [theSession.trainer_id],
          function (err, result) {
            if (err) {
            } else {
              if (
                start < result.rows[0].start_time ||
                end > result.rows[0].end_time
              ) {
                bad = true;
              }
              client.query(
                "SELECT * from classes WHERE class_date = ($1) AND trainer_id = ($2)",
                [day, id],
                function (err, result) {
                  if (err) {
                  } else {
                    if (result.rows.length === 0) {
                    } else {
                      for (let i = 0; i < result.rows.length; i++) {
                        if (
                          start < result.rows[i].start_time &&
                          end > result.rows[i].start_time
                        ) {
                          bad = true;
                        }
                        if (
                          start > result.rows[i].start_time &&
                          end < result.rows[i].end_time
                        ) {
                          bad = true;
                        }
                        if (
                          start < result.rows[i].end_time &&
                          end > result.rows[i].end_time
                        ) {
                          bad = true;
                        }
                        if (
                          parseInt(start) ===
                            parseInt(result.rows[i].start_time) ||
                          parseInt(end) === parseInt(result.rows[i].end_time)
                        ) {
                          bad = true;
                        }
                      }
                    }
                    client.query(
                      "SELECT * from scheduled_sessions WHERE session_date = ($1) AND trainer_id = ($2)",
                      [day, id],
                      function (err, result) {
                        if (err) {
                          console.log(err);
                        } else {
                          for (let i = 0; i < result.rows.length; i++) {
                            if (
                              start < result.rows[i].start_time &&
                              end > result.rows[i].start_time
                            ) {
                              bad = true;
                            }
                            if (
                              start > result.rows[i].start_time &&
                              end < result.rows[i].end_time
                            ) {
                              bad = true;
                            }
                            if (
                              start < result.rows[i].end_time &&
                              end > result.rows[i].end_time
                            ) {
                              bad = true;
                            }
                            if (
                              start === result.rows[i].start_time &&
                              end === result.rows[i].end_time
                            ) {
                              bad = true;
                            }
                          }
                          client.query(
                            "select * FROM classes WHERE room_number = ($1)",
                            [room],
                            function (err, result) {
                              if (err) {
                                console.log(err);
                              } else {
                                for (let i = 0; i < result.rows.length; i++) {
                                  if (
                                    start < result.rows[i].start_time &&
                                    end > result.rows[i].start_time
                                  ) {
                                    bad = true;
                                  }
                                  if (
                                    start > result.rows[i].start_time &&
                                    end < result.rows[i].end_time
                                  ) {
                                    bad = true;
                                  }
                                  if (
                                    start < result.rows[i].end_time &&
                                    end > result.rows[i].end_time
                                  ) {
                                    bad = true;
                                  }
                                  if (
                                    start === result.rows[i].start_time &&
                                    end === result.rows[i].end_time
                                  ) {
                                    bad = true;
                                  }
                                }
                              }

                              if (bad === false) {
                                client.query(
                                  "UPDATE classes SET class_date = ($1), start_time = ($2), end_time = ($3), room_number = ($4) WHERE class_id=($5)",
                                  [
                                    "" + day,
                                    parseInt(start),
                                    end,
                                    room,
                                    parseInt(id),
                                  ],
                                  function (err, result) {
                                    if (err) {
                                      console.log(err);
                                    } else {
                                      res.json(true);
                                    }
                                  }
                                );
                              } else {
                                res.json(false);
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.post("/reschedulesession", upload.array(), (req, res) => {
  const day = req.body.date;
  const start = req.body.start;
  const duration = req.body.duration;
  let end = parseInt(start) + parseInt(duration);
  const id = req.body.id;
  let bad = false;
  let theSession;
  let theTrainer;

  client.query(
    "SELECT * from scheduled_sessions WHERE session_id=($1)",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error executing query", err);
      } else {
        theSession = result.rows[0];
        client.query(
          "SELECT * from trainers WHERE trainer_id = ($1)",
          [theSession.trainer_id],
          function (err, result) {
            if (err) {
              console.log(err);
            } else {
              if (
                start < result.rows[0].start_time ||
                end > result.rows[0].end_time
              ) {
                bad = true;
              }
              client.query(
                "SELECT * from classes WHERE class_date = ($1) AND trainer_id = ($2)",
                [day, id],
                function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    if (result.rows.length === 0) {
                    } else {
                      for (let i = 0; i < result.rows.length; i++) {
                        if (
                          start < result.rows[i].start_time &&
                          end > result.rows[i].start_time
                        ) {
                          bad = true;
                        }
                        if (
                          start > result.rows[i].start_time &&
                          end < result.rows[i].end_time
                        ) {
                          bad = true;
                        }
                        if (
                          start < result.rows[i].end_time &&
                          end > result.rows[i].end_time
                        ) {
                          bad = true;
                        }
                        if (
                          parseInt(start) ===
                            parseInt(result.rows[i].start_time) ||
                          parseInt(end) === parseInt(result.rows[i].end_time)
                        ) {
                          bad = true;
                        }
                      }
                    }
                    client.query(
                      "SELECT * from scheduled_sessions WHERE session_date = ($1) AND trainer_id = ($2)",
                      [day, id],
                      function (err, result) {
                        if (err) {
                          console.log(err);
                        } else {
                          end = parseInt(start) + parseInt(duration);
                          for (let i = 0; i < result.rows.length; i++) {
                            if (
                              start < result.rows[i].start_time &&
                              end > result.rows[i].start_time
                            ) {
                              bad = true;
                            }
                            if (
                              start > result.rows[i].start_time &&
                              end < result.rows[i].end_time
                            ) {
                              bad = true;
                            }
                            if (
                              start < result.rows[i].end_time &&
                              end > result.rows[i].end_time
                            ) {
                              bad = true;
                            }
                            if (
                              start === result.rows[i].start_time &&
                              end === result.rows[i].end_time
                            ) {
                              bad = true;
                            }
                          }
                          if (bad === false) {
                            client.query(
                              "UPDATE scheduled_sessions SET session_date = ($1), start_time = ($2), end_time = ($3) WHERE session_id=($4)",
                              ["" + day, parseInt(start), end, parseInt(id)],
                              function (err, result) {
                                if (err) {
                                  console.log(err);
                                } else {
                                  res.json(true);
                                }
                              }
                            );
                          } else {
                            res.json(false);
                          }
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.post("/schedulesession", upload.array(), (req, res) => {
  console.log("schedule");
  const day = req.body.date;
  const id = req.body.trainer;
  const topic = req.body.topic;
  const start = req.body.start;
  const duration = req.body.duration;
  let bad = false;

  client.query(
    "SELECT * from scheduled_sessions WHERE session_date = ($1) AND trainer_id = ($2)",
    [day, id],
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        end = parseInt(start) + parseInt(duration);
        for (let i = 0; i < result.rows.length; i++) {
          if (
            start < result.rows[i].start_time &&
            end > result.rows[i].start_time
          ) {
            bad = true;
          }
          if (
            start > result.rows[i].start_time &&
            end < result.rows[i].end_time
          ) {
            bad = true;
          }
          if (
            start < result.rows[i].end_time &&
            end > result.rows[i].end_time
          ) {
            bad = true;
          }
          if (
            start === result.rows[i].start_time &&
            end === result.rows[i].end_time
          ) {
            bad = true;
          }
        }

        client.query(
          "SELECT * from trainers WHERE trainer_id = ($1)",
          [id],
          function (err, result) {
            if (err) {
              console.log(err);
            } else {
              if (
                start < result.rows[0].start_time ||
                end > result.rows[0].end_time
              ) {
                bad = true;
              }

              client.query(
                "SELECT * from classes WHERE class_date = ($1) AND trainer_id = ($2)",
                [day, id],
                function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    if (result.rows.length === 0) {
                    } else {
                      for (let i = 0; i < result.rows.length; i++) {
                        if (
                          start < result.rows[i].start_time &&
                          end > result.rows[i].start_time
                        ) {
                          bad = true;
                        }
                        if (
                          start > result.rows[i].start_time &&
                          end < result.rows[i].end_time
                        ) {
                          bad = true;
                        }
                        if (
                          start < result.rows[i].end_time &&
                          end > result.rows[i].end_time
                        ) {
                          bad = true;
                        }
                        if (
                          parseInt(start) ===
                            parseInt(result.rows[i].start_time) ||
                          parseInt(end) === parseInt(result.rows[i].end_time)
                        ) {
                          bad = true;
                        }
                      }
                    }
                  }
                }
              );

              if (bad === false) {
                client.query(
                  "INSERT into scheduled_sessions (user_id, trainer_id, session_date, session_name, start_time, end_time, paid_for) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                  [signedIn.slice(1), id, day, topic, start, end, 0],
                  function (err, result) {
                    if (err) {
                      console.log(err);
                    } else {
                      res.json(true);
                    }
                  }
                );
              } else {
                res.json(false);
              }
            }
          }
        );
      }
    }
  );
});

app.post("/userdropclass", upload.array(), (req, res) => {
  const id = req.body.id;
  client.query(
    "DELETE FROM class_participants WHERE class_id = ($1) and user_id=($2)",
    [id, signedIn.slice(1)],
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
      }
    }
  );
});

app.post("/dropclass", upload.array(), (req, res) => {
  const id = req.body.id;
  client.query(
    "DELETE FROM classes WHERE class_id = ($1)",
    [id],
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        client.query(
          "DELETE FROM class_participants WHERE class_id = ($1)",
          [id],
          function (err, result) {
            if (err) {
              console.log(err);
            } else {
            }
          }
        );
      }
    }
  );
});

app.post("/dropsession", upload.array(), (req, res) => {
  const id = req.body.id;
  client.query(
    "DELETE FROM scheduled_sessions WHERE session_id = ($1)",
    [id],
    function (err, result) {
      if (err) {
        console.log(err);
      }
    }
  );
});

app.post("/register", upload.array(), (req, res) => {
  const first = req.body.first;
  const last = req.body.last;
  const email = req.body.email;
  const pass = req.body.password;
  const height = req.body.height;
  const weight = req.body.weight;
  client.query(
    "INSERT into users (first_name, last_name, email, pass, height, mass) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
    [first, last, email, pass, height, weight],
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is listening at port http://127.0.0.1:3000/`);
});
