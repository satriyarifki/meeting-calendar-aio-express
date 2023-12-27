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
  // console.log(req.body);
  let participants = [];
  req.body.participants.split(",").forEach((element) => {
    participants.push[{ email: element }];
  });
  const event = {
    start: [
      req.body.year,
      req.body.month,
      req.body.day,
      req.body.hour_start,
      req.body.minute_start,
    ],
    end: [
      req.body.year,
      req.body.month,
      req.body.day,
      req.body.hour_end,
      req.body.minute_end,
    ],
    // duration: { hours: 2 },
    title: req.body.title,
    description: req.body.message,
    // status: "CONFIRMED",
    location: "Otsuka",
    // method: "REQUEST",
    alarms: [
      {
        action: "display",
        description: "Reminder",
        trigger: { hours: 1, minutes: 30, before: true },
      },
    ],
    organizer: { name: req.body.organizer[1], email: req.body.organizer[0] },
    // attendees: participants,
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
    from: req.body.organizer[1] + "<appskjy@aio.co.id>",
    to: req.body.participants, // list of receivers
    subject: "AIO Meeting Invitation ", // Subject line
    // html: '<b>' + req.body.message + '</b>', // html body
    text: req.body.message, // plain text body
    icalEvent: {
      filename: "invitation.ics",
      // method: "request",
      // contentType: "text/calendar",
      // encoding: 'base64',
      // contentDisposition: 'attachment',
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
  // console.log(req.body);
});

router.post("/send/vote-email", async (req, res, next) => {
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
  let participants = [];
  req.body.participants.split(",").forEach((element) => {
    participants.push[{ email: element }];
  });
  var mail = {
    // sender address
    from: req.body.organizer[1] + "<appskjy@aio.co.id>",
    to: req.body.participants, // list of receivers
    subject: "Vote Acceptance Reminder ", // Subject line
    // html: '<b>' + req.body.message + '</b>', // html body
    text: req.body.title + req.body.message, // plain text body
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
})

module.exports = router;
