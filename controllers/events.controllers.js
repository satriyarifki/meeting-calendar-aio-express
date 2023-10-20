const Validator = require("fastest-validator");
const v = new Validator();
const { Sequelize, QueryTypes } = require("sequelize");
const { connectMataHo } = require("../config/connections");
const { events } = require("./../models");
// let { startOfDay, endOfDay, parseISO } = require('date-fns');
const apiResponse = require("./../traits/api-response");
const { Op } = require("sequelize");
const fs = require("fs");

exports.index = async (req, res) => {
  try {
    const response = await events.findAll();

    apiResponse.sucess(res, response, 200);

    // });
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
exports.store = async (req, res) => {
  try {
    // const schema = {
    // 	userId: { type: 'number', integer: true },
    // 	title: { type: 'string' },
    // 	organizer: { type: 'string' },
    // 	description: { type: 'string' },
    // 	url_online: { type: 'string' },
    // 	message: { type: 'string' },
    // 	date: { type: 'date', nullable: false },
    // };

    // const validate = v.validate(req.body, schema);

    // if (validate.length) {
    // 	apiResponse.error(res, validate, 400);
    // }

    const response = await events.create(req.body);

    apiResponse.sucess(res, response, 201);
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await events.update(req.body, { where: { id } });

    apiResponse.sucess(res, response, 201);
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
exports.dateRange = async (req, res) => {
  try {
    // const { page, size } = req.query;
    // const { limit, offset } = getPagination(page, size);

    const response = await events.findAll({
      where: {
        date: {
          [Op.between]: [req.params.from, req.params.to],
        },
      },
    });

    apiResponse.sucess(res, response, 200);
    // events.findAll({ limit, offset }).then((data) => {
    // 	const response = getPagingData(page, limit, data);

    // });
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
exports.destroy = async (req, res) => {
  try {
    const id = req.params.id;
    let data = await events.findByPk(id);

    if (!data) {
      apiResponse.sucess(res, "Data is not found!", 203);
    }

    await data.destroy(id);

    res.status(200).json({ message: "Data was deleted!" });
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
exports.test = async (req, res) => {
  try {
    //
    let result = [];
    const mrkContent = fs.readFileSync("controllers/Calendar.mrk", "utf8");

    const regexSquare = /A\[([^\]]*)\]]/;
    const regexArrow = /\>([^\]]*)\</;

    const regexStart = /id>\r\n<Start>([\s\S]*?)<\/Start>/g;
    const regexSubject = /<Subject>([\s\S]*?)<\/Subject>/g;
    const regexCreator = /<Creator>([\s\S]*?)<\/Creator>/g;
    const regexPlanner = /<Planner>([\s\S]*?)<\/Planner>/g;
    const regexEnd =
      /id>\r\n<Start>([\s\S]*?)<\/Start>\r\n<End>([\s\S]*?)<\/End>\r\n<Su/g;
    const regexModified = /<Modified>([\s\S]*?)<\/Modified>/g;

    const mrkStart = mrkContent.match(regexStart);
    const mrkSubject = mrkContent.match(regexSubject);
    const mrkCreator = mrkContent.match(regexCreator);
    const mrkPlanner = mrkContent.match(regexPlanner);
    const mrkEnd = mrkContent.match(regexEnd);
    const mrkModified = mrkContent.match(regexModified);
    mrkSubject.forEach((element, i) => {
      result.push({
        subject: element.match(regexSquare)[1],
        creator: mrkCreator[i].match(regexSquare)[1],
        planner: mrkPlanner[i].match(regexSquare)[1],
        time_start: mrkStart[i].match(/t\>([^\]]*)\</)[1],
        time_end: mrkEnd[i].match(/End\>([^\]]*)\<\//)[1],
        modified_at: mrkModified[i].match(regexArrow)[1],
      });
    });

    //   console.log(mrkStart.length);
    //   console.log(mrkEnd.length);
    //   console.log(mrkSubject.length);
    //   console.log(mrkCreator.length);
    //   console.log(mrkPlanner.length);
    //   console.log(mrkModified.length);
    // const response = { trucking: trucking, arrival: arrival, deliveryDestination: delivery };
    console.log(result);
    let response = [];
    await result.forEach((element, i) => {
      // console.log(element);
      response.push("");
      response[i] = connectMataHo.query(
        "INSERT INTO mst_calendar_events (`subject` ,`creator` ,`planner` ,`start_time`, end_time, modified_at) VALUES ($subject ,$creator ,$planner ,$start_time, $end_time, $modified_at) ",
        {
          bind: {
            subject: element.subject,
            creator: element.creator,
            planner: element.planner,
            start_time: element.time_start,
            end_time: element.time_end,
            modified_at: element.modified_at,
          },
          type: QueryTypes.INSERT,
        }
      );
    });

    res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
exports.index_calendar_ho = async (req, res) => {
	try {
	  //
	  const response = await connectMataHo.query("SELECT * FROM mst_calendar_events", {
		type: QueryTypes.SELECT,
	  });
	  // const response = { trucking: trucking, arrival: arrival, deliveryDestination: delivery };
	  res.status(200).json(response);
	} catch (e) {
	  return res.status(500).json({ error: e.message });
	}
  };
