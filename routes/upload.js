var express = require("express");
var router = express();
multer = require("multer");
const { attachments } = require("./../models");
const ics = require("ics");
const nodemailer = require("nodemailer");
const apiResponse = require("./../traits/api-response");
// const upload = multer({ dest: './public/data/uploads/' })

// File upload settings
const PATH = "./public/uploads";
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
let upload = multer({
  storage: storage,
});

router.post("/", upload.single("files"), async function (req, res) {
  try {
    console.log(req.file);
    if (!req.file) {
      console.log(req.body);
      console.log("No file is available!");
      return res.status(404).send("No FOund");
    } else {
      // console.log("File is available!");

      const body = {
        eventId: req.body.dataId,
        fileName: req.file.filename,
        realName: req.file.originalname,
        path: req.file.path,
        type: req.file.mimetype,
        sizeBytes: req.file.size,
      };

      const response = attachments.create(body, {
        fields: [
          "eventId",
          "fileName",
          "realName",
          "path",
          "type",
          "sizeBytes",
        ],
      });
      // console.log(req.body);
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
        organizer: { name: req.body.organizer, email: req.body.organizer },
        // attendees: participants,
      };
      let eventIcs;
      ics.createEvent(event, (err, value) => {
        if (err) {
          console.log(err);
          return;
        }
        eventIcs = value;
        // console.log(String(value));
      });
      if (req.body.date != null) {
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
        // console.log(req.body.participants);
        var mail = {
          // sender address
          from: req.body.organizer + "<appskjy@aio.co.id>",
          to: req.body.participants, // list of receivers
          subject: "AIO Meeting Invitation ", // Subject line
          // html: '<b>' + req.body.message + '</b>', // html body
          text: req.body.message, // plain text body
          attachments: [
            {
              // file on disk as an attachment
              filename: req.file.originalname,
              path: req.file.path, // stream this file
            },
          ],
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
            console.log(error);
            // res.send(error);
          } else {
            console.log(info);
            // res.send(info);
          }
        });
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(infos));
      }
      return res
        .status(200)
        .send({ file: req.file, resAttach: response, mail: req.body.mail });
    }
  } catch (err) {
    console.log(err);
    apiResponse.error(res, err.message, 500);
  }
});
router.post("/email", upload.single("files"), async function (req, res) {
  try {
    if (!req.file) {
      console.log("No file is available!");
      return res.status(404).send("Not FOund");
    } else {
      console.log("File is available!");
      console.log(req.body.dataId);
      const body = {
        eventId: req.body.dataId,
        fileName: req.file.filename,
        realName: req.file.originalname,
        path: req.file.path,
        type: req.file.mimetype,
        sizeBytes: req.file.size,
      };
      const response = attachments.create(body, {
        fields: [
          "eventId",
          "fileName",
          "realName",
          "path",
          "type",
          "sizeBytes",
        ],
      });
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

      var mail = {
        // sender address
        from: req.body.organizer + "<appskjy@aio.co.id>",
        to: req.body.participants, // list of receivers
        subject: "AIO Meeting Invitation ", // Subject line
        // html: '<b>' + req.body.message + '</b>', // html body
        text: req.body.message, // plain text body
        attachments: [
          {
            // file on disk as an attachment
            filename: req.file.originalname,
            path: req.file.path, // stream this file
          },
        ],
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
      return res.status(200).send({ file: req.file, resAttach: response });
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});
// router.post("/upload", function (req, res) {
//   upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred when uploading.
//     } else if (err) {
//       // An unknown error occurred when uploading.
//     }

//     // Everything went fine.
//   });
// });

module.exports = router;
