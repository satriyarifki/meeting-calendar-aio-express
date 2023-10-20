var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
const eventController = require("./../controllers/events.controllers");
const participantsController = require("./../controllers/participants.controller");
const roomsController = require("./../controllers/rooms.controller");
const authController = require("./../controllers/auth.controllers");
const employeesController = require("./../controllers/employees.controller");
const attachmentsController = require("./../controllers/attachments.controller");

urlencoded = bodyParser.urlencoded({ extended: false });

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
// router.post('/signin', authController.login);

router.get("/events", eventController.index);
router.post("/events", eventController.store);
router.get("/events/:from/:to", eventController.dateRange);
router.post("/events/:id", eventController.update);
router.delete("/events/:id", eventController.destroy);
router.get("/events/test", eventController.test);
router.get("/events/ho", eventController.index_calendar_ho);

router.get("/participants", participantsController.index);
router.post("/participants", participantsController.store);
router.delete("/participants/:eventId", participantsController.destroy);

router.get("/rooms", roomsController.index);

// -------------------------------> Employees
router.get("/employees/email", employeesController.employeesEmail);
router.get("/employees/m2up", employeesController.employeesM2Up);
router.get("/employees/name-email", employeesController.employeesNameEmail);

//--------------------------------> Attachments
router.get("/attachments", attachmentsController.index);
router.get("/attachments/:eventId", attachmentsController.getById);
router.delete("/attachments/:eventId", attachmentsController.destroy);



module.exports = router;
