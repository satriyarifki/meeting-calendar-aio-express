var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
const eventController = require("./../controllers/events.controllers");
const participantsController = require("./../controllers/participants.controller");
const roomsController = require("./../controllers/rooms.controller");
const authController = require("./../controllers/auth.controllers");
const employeesController = require("./../controllers/employees.controller");
const attachmentsController = require("./../controllers/attachments.controller");
const votesController = require("../controllers/votes.controller");
const voteDetailsController = require("../controllers/vote_details.controller");
const voteTimesController = require("../controllers/vote_times.controller");
const voteParticipantsController = require("../controllers/vote_participants.controller");
const holidaysController = require("../controllers/holidays.controller");

urlencoded = bodyParser.urlencoded({ extended: false });

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
// router.post('/signin', authController.login);

// Holiday
router.get("/holiday/:year", holidaysController.index);
router.get("/holiday/:year/:month", holidaysController.byMonthYear);

// EVENT
router.get("/events", eventController.index);
router.post("/events", eventController.store);
router.get("/events/:from/:to", eventController.dateRange);
router.post("/events/:id", eventController.update);
router.delete("/events/:id", eventController.destroy);
router.get("/events/test", eventController.test);
router.get("/events/ho", eventController.index_calendar_ho);
router.get("/event/ho/:date", eventController.index_ho_by_date);

router.get("/participants", participantsController.index);
router.post("/participants", participantsController.store);
router.delete("/participants/:eventId", participantsController.destroy);


router.get("/rooms", roomsController.index);

// -------------------------------> Employees
router.get("/employees", employeesController.index);
router.get("/employees/email", employeesController.employeesEmail);
router.get("/employees/m2up", employeesController.employeesM2Up);
router.get("/employees/name-email", employeesController.employeesNameEmail);

//--------------------------------> Attachments
router.get("/attachments", attachmentsController.index);
router.get("/attachments/:eventId", attachmentsController.getById);
router.delete("/attachments/:eventId", attachmentsController.destroy);

// -------------------------------> Vote
router.get("/votes", votesController.index);
router.get("/vote/:id", votesController.indexById);
router.get("/vote/user/:userId", votesController.indexByUser);
router.post("/vote", votesController.store);
router.delete("/vote/:id", votesController.destroy);



// -------------------------------> Vote Details
router.get("/vote-details", voteDetailsController.index);
router.get("/vote-details/:voteId", voteDetailsController.indexByVote);
router.get("/vote-details/group-vote/:voteId", voteDetailsController.indexGroupedByVote);
router.get("/vote-details/group/:userId", voteDetailsController.indexGroupedByUser);
router.post("/vote-details", voteDetailsController.store);
router.put("/vote-details", voteDetailsController.update);

// -------------------------------> Vote Times
router.get("/vote-times", voteTimesController.index);
router.post("/vote-times", voteTimesController.store);
router.put("/vote-times", voteTimesController.update);

//--------------------------------> Vote Participants
router.get("/vote-participants", voteParticipantsController.index);
router.post("/vote-participants", voteParticipantsController.store);

module.exports = router;
