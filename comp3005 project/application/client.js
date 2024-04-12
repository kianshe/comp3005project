window.onload = function () {
  var registerButton = document.getElementById("register");
  var signinButton = document.getElementById("sign in");
  var signoutButton = document.getElementById("sign out");
  var dropSessionButton = document.getElementById("dropbutton");
  var scheduelSessionButton = document.getElementById("schedulebutton");
  var weightButton = document.getElementById("updateweightbutton");
  var goalButton = document.getElementById("addgoalbutton");
  var createClassButton = document.getElementById("createclassbutton");
  var setTimesButton = document.getElementById("set");
  var dropClassButton = document.getElementById("dropclassbutton");
  var enrollClassButton = document.getElementById("enrollclassbutton");
  var userDropClassButton = document.getElementById("userdropclassbutton");
  var rescheduleSessionButton = document.getElementById("reschedulebutton");
  var payButton = document.getElementById("paybutton");
  var rescheduleClassButton = document.getElementById("rescheduleclassbutton");
  var serviceButton = document.getElementById("servicebutton");
  var addEquipmentButton = document.getElementById("addequipmentbutton");
  var removeEquipmentButton = document.getElementById("removeequipmentbutton");
  var addAchievementButton = document.getElementById("addachievementbutton");
  var addRoutineButton = document.getElementById("addexercisebutton");
  var removeRoutineButton = document.getElementById("removeexercisebutton");
  var adminRemoveUserButton = document.getElementById("admindropuserbutton");

  if (registerButton) {
    registerButton.addEventListener("click", register);
  }
  if (signinButton) {
    signinButton.addEventListener("click", signin);
  }

  if (signoutButton) {
    signoutButton.addEventListener("click", signout);
  }

  if (dropSessionButton) {
    dropSessionButton.addEventListener("click", dropSession);
  }

  if (scheduelSessionButton) {
    scheduelSessionButton.addEventListener("click", scheduleSession);
  }

  if (weightButton) {
    weightButton.addEventListener("click", updateWeight);
  }

  if (goalButton) {
    goalButton.addEventListener("click", addGoal);
  }

  if (createClassButton) {
    createClassButton.addEventListener("click", createClass);
  }

  if (setTimesButton) {
    setTimesButton.addEventListener("click", setTimes);
  }

  if (dropClassButton) {
    dropClassButton.addEventListener("click", dropClass);
  }

  if (enrollClassButton) {
    enrollClassButton.addEventListener("click", enrollInClass);
  }

  if (userDropClassButton) {
    userDropClassButton.addEventListener("click", userDropClass);
  }

  if (rescheduleSessionButton) {
    rescheduleSessionButton.addEventListener("click", rescheduleSession);
  }

  if (payButton) {
    payButton.addEventListener("click", pay);
  }

  if (rescheduleClassButton) {
    rescheduleClassButton.addEventListener("click", rescheduleClass);
  }

  if (serviceButton) {
    serviceButton.addEventListener("click", serviceEquipment);
  }
  if (addEquipmentButton) {
    addEquipmentButton.addEventListener("click", addEquipment);
  }
  if (removeEquipmentButton) {
    removeEquipmentButton.addEventListener("click", removeEquipment);
  }

  if (addAchievementButton) {
    addAchievementButton.addEventListener("click", addAchievement);
  }

  if (addRoutineButton) {
    addRoutineButton.addEventListener("click", addRoutine);
  }

  if (removeRoutineButton) {
    removeRoutineButton.addEventListener("click", removeRoutine);
  }

  if (adminRemoveUserButton) {
    adminRemoveUserButton.addEventListener("click", adminRemoveUser);
  }

  async function adminRemoveUser() {
    var classOrSession = document.getElementById("admindropuser");
    classOrSession = classOrSession.value;

    var classId = document.getElementById("admindropuserclassid");
    classId = classId.value;

    var userId = document.getElementById("admindropuseruserid");
    userId = userId.value;

    const response = await post("/adminRemoveUser", {
      which: classOrSession,
      class: classId,
      user: userId,
    });
    const body = await response.json();
    if (body == true) {
      alert("sucessfully removed");
      window.location.reload();
    } else {
      alert("there was an error");
    }
  }

  async function removeRoutine() {
    var exerciseId = document.getElementById("exercise");
    exerciseId = exerciseId.value;

    const response = await post("/removeRoutine", {
      id: exerciseId,
    });
    const body = await response.json();
    if (body == true) {
      alert("removed routine");
      window.location.reload();
    } else {
      alert("there was an error");
    }
  }

  async function addRoutine() {
    var routineName = document.getElementById("exercisename");
    routineName = routineName.value;

    var number = document.getElementById("exercisereps");
    number = number.value;

    const response = await post("/addRoutine", {
      name: routineName,
      reps: number,
    });
    const body = await response.json();
    if (body == true) {
      alert("added routine");
      window.location.reload();
    } else {
      alert("there was an error");
    }
  }

  async function addAchievement() {
    var achievementDate = document.getElementById("achievementdate");
    achievementDate = achievementDate.value;

    var achievementName = document.getElementById("achievementname");
    achievementName = achievementName.value;

    const response = await post("/addAchievement", {
      name: achievementName,
      date: achievementDate,
    });
    const body = await response.json();
    if (body == true) {
      alert("added achievement");
      window.location.reload();
    } else {
      alert("there was an error");
    }
  }

  async function addEquipment() {
    var equipmentName = document.getElementById("addequipment");
    equipmentName = equipmentName.value;

    const response = await post("/addEquipment", {
      name: equipmentName,
    });
    const body = await response.json();
    if (body == true) {
      alert("added equipment");
      window.location.reload();
    } else {
      alert("there was an error");
    }
  }

  async function removeEquipment() {
    var equipmentId = document.getElementById("removequipment");
    equipmentId = equipmentId.value;

    const response = await post("/removeEquipment", {
      id: equipmentId,
    });
    const body = await response.json();
    if (body == true) {
      alert("remove equipment");
      window.location.reload();
    } else {
      alert("there was an error");
    }
  }

  async function serviceEquipment() {
    var serviceDate = document.getElementById("servicedate");
    serviceDate = serviceDate.value;

    var serviceId = document.getElementById("service");
    serviceId = serviceId.value;

    if (serviceDate != "") {
      const response = await post("/service", {
        date: serviceDate,
        id: serviceId,
      });
      const body = await response.json();
      if (body == true) {
        alert("serviced equipment");
        window.location.reload();
      } else {
        alert("there was an error");
      }
    }
  }

  async function rescheduleClass() {
    var classDate = document.getElementById("rescheduleclassdate");
    classDate = classDate.value;

    var classStart = document.getElementById("rescheduleclassstart");
    classStart = classStart.value;

    var classEnd = document.getElementById("rescheduleclassend");
    classEnd = classEnd.value;

    var classId = document.getElementById("rescheduleclass");
    classId = classId.value;

    var classRoom = document.getElementById("rescheduleclassroom");
    classRoom = classRoom.value;

    if (classDate != "") {
      const response = await post("/rescheduleclass", {
        date: classDate,
        start: classStart,
        end: classEnd,
        id: classId,
        room: classRoom,
      });
      const body = await response.json();
      if (body == true) {
        alert("rescheduled class");
        window.location.reload();
      } else {
        alert("sorry, that time is unavailable");
      }
    }
  }

  async function pay() {
    var theType = document.getElementById("sessionorclass");
    theType = theType.value;

    var theId = document.getElementById("payid");
    theId = theId.value;

    const response = await post("/pay", {
      typ: theType,
      id: theId,
    });
    const body = await response.json();
    if (body == true) {
      alert("sucessfully paid");
      window.location.reload();
    } else {
      alert("sorry, there was an error");
    }
  }

  async function rescheduleSession() {
    var sessionDate = document.getElementById("rescheduledate");
    sessionDate = sessionDate.value;

    var sessionStart = document.getElementById("reschedulestart");
    sessionStart = sessionStart.value;

    var sessionDuration = document.getElementById("rescheduledurations");
    sessionDuration = sessionDuration.value;

    var sessionId = document.getElementById("reschedulesession");
    sessionId = sessionId.value;

    if (sessionDate != "") {
      const response = await post("/reschedulesession", {
        date: sessionDate,
        start: sessionStart,
        duration: sessionDuration,
        id: sessionId,
      });
      const body = await response.json();
      if (body == true) {
        alert("rescheduled session");
        window.location.reload();
      } else {
        alert("sorry, that trainer is unavailable at that time");
      }
    }
  }

  function userDropClass() {
    var classId = document.getElementById("userdropclass");
    classId = classId.value;

    post("/userdropclass", { id: classId });
    alert("sucessfully dropped class");
    window.location.reload();
  }

  async function enrollInClass() {
    var classId = document.getElementById("enrollclass");
    classId = classId.value;

    const response = await post("/enrollclass", {
      id: classId,
    });
    const body = await response.json();
    if (body == true) {
      alert("sucesfully enrolled");
      window.location.reload();
    } else {
      alert("there was an error");
    }
  }

  async function setTimes() {
    var newStart = document.getElementById("start");
    newStart = newStart.value;

    var newEnd = document.getElementById("end");
    newEnd = newEnd.value;

    var trainerId = document.getElementById("trainerId");
    trainerId = trainerId.innerHTML;
    trainerId = trainerId.slice(-1);

    const response = await post("/setTimes", {
      start: newStart,
      end: newEnd,
      id: trainerId,
    });
    const body = await response.json();
    if (body == true) {
      alert("changed times");
      window.location.reload();
    } else {
      alert("there was an error");
    }
  }

  async function createClass() {
    var cTopic = document.getElementById("classname");
    cTopic = cTopic.value;

    var trainerId = document.getElementById("classtrainers");
    trainerId = trainerId.value;

    var roomNumber = document.getElementById("roomnumber");
    roomNumber = roomNumber.value;

    var newDate = document.getElementById("classdate");
    newDate = newDate.value;

    var startTime = document.getElementById("classstart");
    startTime = startTime.value;

    var endTime = document.getElementById("classend");
    endTime = endTime.value;

    const response = await post("/addclass", {
      date: newDate,
      topic: cTopic,
      id: trainerId,
      room: roomNumber,
      start: startTime,
      end: endTime,
    });
    const body = await response.json();
    if (body == true) {
      alert("added class");
      window.location.reload();
    } else {
      alert("there was an error");
    }
  }

  async function addGoal() {
    var newDate = document.getElementById("goaldate");
    newDate = newDate.value;

    var newWeight = document.getElementById("goalweight");
    newWeight = newWeight.value;

    const response = await post("/addgoal", {
      date: newDate,
      weight: newWeight,
    });
    const body = await response.json();
    if (body == true) {
      alert("added goal");
      window.location.reload();
    }
  }

  async function updateWeight() {
    var weight = document.getElementById("updateweight");
    weight = weight.value;

    const response = await post("/updateweight", {
      new: weight,
    });
    const body = await response.json();
    if (body == true) {
      alert("updated weight");
      window.location.reload();
    }
  }

  async function scheduleSession() {
    var sessionTopic = document.getElementById("sessiontopic");
    sessionTopic = sessionTopic.value;

    var sessionDate = document.getElementById("sessiondate");
    sessionDate = sessionDate.value;

    var sessionTrainer = document.getElementById("trainers");
    sessionTrainer = sessionTrainer.value;

    var sessionStart = document.getElementById("sessionstart");
    sessionStart = sessionStart.value;

    var sessionDuration = document.getElementById("sessionduration");
    sessionDuration = sessionDuration.value;

    if (sessionDate != "" && sessionTopic != "") {
      const response = await post("/schedulesession", {
        topic: sessionTopic,
        date: sessionDate,
        trainer: sessionTrainer,
        start: sessionStart,
        duration: sessionDuration,
      });
      const body = await response.json();
      if (body == true) {
        alert("scheduled session");
        window.location.reload();
      } else {
        alert("sorry, that trainer is unavailable at that time");
      }
    }
  }

  function dropClass() {
    var classId = document.getElementById("dropclass");
    classId = classId.value;

    post("/dropclass", { id: classId });
    alert("sucessfully dropped class");
    window.location.reload();
  }

  function dropSession() {
    var sessionId = document.getElementById("dropsession");
    sessionId = sessionId.value;

    post("/dropsession", { id: sessionId });
    alert("sucessfully dropped session");
    window.location.reload();
  }

  function signout() {
    alert("signed out");
    post("/signout", {});
  }

  async function signin() {
    var email = document.getElementById("email");
    sendEmail = email.value;

    var pass = document.getElementById("password");
    sendPass = pass.value;

    var person = document.getElementById("type");
    person = person.value;

    const response = await post("/signin", {
      email: sendEmail,
      password: sendPass,
      type: person,
    });
    const body = await response.json();

    if (body === false) {
      alert("sorry, this information did not match in our system");
    } else {
      try {
        if (body[0].email === sendEmail && body[0].pass === sendPass) {
          alert("signed in, hello " + body[0].first_name);
        }
      } catch (err) {
        console.log(err);
        alert("sorry, this information did not match in our system");
      }
    }
  }

  function register() {
    var addfirst = document.getElementById("firstname");
    addfirst = addfirst.value;

    var addlast = document.getElementById("lastname");
    addlast = addlast.value;

    var addemail = document.getElementById("email");
    addemail = addemail.value;

    var addpassword = document.getElementById("password");
    addpassword = addpassword.value;

    var addheight = document.getElementById("height");
    addheight = addheight.value;

    var addweight = document.getElementById("weight");
    addweight = addweight.value;

    post("/register", {
      first: addfirst,
      last: addlast,
      email: addemail,
      password: addpassword,
      height: addheight,
      weight: addweight,
    });
    alert("registered");
  }

  window.post = function (url, data) {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  // ...
};
