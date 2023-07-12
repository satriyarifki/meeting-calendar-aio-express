var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
const apiResponse = require("./../traits/api-response");
const ics = require("ics");
const { aioEmployee } = require("../config/config");

router.post("/send", async (req, res, next) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: "mail.aio.co.id",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "appskjy@aio.co.id",
      pass: "Plicakjy1234",
    },
    from: "appskjy@aio.co.id",
  });
  console.log(req.body);
  const event = {
    start: [2023, 7, 13, 8, 30],
    duration: { hours: 2 },
    title: req.body.title,
    description: req.body.message,
    location: "Otsuka",
    alarms: [
      {
        action: "display",
        description: "Reminder",
        trigger: { hours: 1, minutes: 30, before: true },
      },
    ],
  };
  let eventIcs;
  ics.createEvent(event, (err, value) => {
    if (err) {
      console.log(err);
      return;
    }
    eventIcs = value;
    console.log(String(value));
  });
  var mail = {
    // sender address
    from: req.body.organizer + "<appskjy@aio.co.id>",
    to: req.body.participants, // list of receivers
    subject: "AIO Meeting Invitation ", // Subject line
    // html: '<b>' + req.body.message + '</b>', // html body
    // text: req.body.message, // plain text body
    icalEvent: {
      filename: "invitation.ics",
      method: "request",
      content: eventIcs,
    },
  };

  // send mail with defined transport object
  let infos = await transporter.sendMail(mail, function (error, info) {
    if (error) {
      res.send(error);
    } else {
      // console.log(info);
      res.send(info);
    }
  });

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(infos));
  console.log(req.body);
});

module.exports = router;
