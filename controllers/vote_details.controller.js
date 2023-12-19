const Validator = require("fastest-validator");
const v = new Validator();
const { Sequelize, QueryTypes } = require("sequelize");
const { vote_details, votes, vote_times } = require("../models");
// let { startOfDay, endOfDay, parseISO } = require('date-fns');
const apiResponse = require("../traits/api-response");
const { Op } = require("sequelize");

exports.index = async (req, res) => {
  try {
    const response = await vote_details.findAll({
	  where: { voteId: voteId },
      attributes: ["id","voteId", "date", "userId"],
      include: [{ model: votes }],
    });

    apiResponse.sucess(res, response, 200);

    // });
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
exports.indexByVote = async (req, res) => {
  try {
    const { voteId } = req.params;
    const response = await vote_details.findAll({
      attributes: ["id","voteId", "date", "userId"],
      where: { voteId: voteId },
      order: [[Sequelize.cast(Sequelize.col("userId"), "INT"), "ASC"]],
	  include: [{model:vote_times}]
    });

    apiResponse.sucess(res, response, 200);

    // });
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
exports.indexGroupedByVote = async (req, res) => {
  try {
    const { voteId } = req.params;
    const response = await vote_details.findAll({
      attributes: ["id","voteId", "date", "userId"],
      where: { voteId: voteId },
      order: [[Sequelize.cast(Sequelize.col("userId"), "INT"), "ASC"]],
      group: ["date", "userId"],
	  include: [{model:vote_times}]
    });

    apiResponse.sucess(res, response, 200);

    // });
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
exports.indexGroupedByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await vote_details.findAll({
      attributes: ["id","voteId", "date", "userId"],
      where: { userId: userId },
    //   group: ["voteId"],
      include: [{ model: votes }],
    });

    apiResponse.sucess(res, response, 200);

    // });
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
exports.store = async (req, res) => {
  try {
    const { voteId, details, participants } = req.body;
    let response = [];
    details.forEach((element) => {
      participants.forEach(async (elem) => {
        let resp = await vote_details.create(
          { voteId: voteId, date: element.date, userId: elem.userId },
          { fields: ["voteId", "date", "userId"] }
        );
        response.push(resp);
        element.times.forEach(async (el) => {
          if (el.time != "") {
            let respo = await vote_times.create({
              voteDetailId: resp.id,
              time: el.time,
              agree: el.agree,
            });
          }
        });
      });
    });
    //   const response = await vote_details.create(req.body);

    apiResponse.sucess(res, response, 201);
  } catch (e) {
    console.log(e.message);
    apiResponse.error(res, e.message, 500);
  }
};
exports.update = async (req, res) => {
  try {
    const data = req.body;
    console.log(req.body);
    let response = [];
    data.forEach((elem) => {
      response.push(
        vote_details.update(elem, {
          fields: ["agree"],
          where: { voteId: elem.voteId, date: elem.date, userId: elem.userId },
        })
      );
    });
    //   const response = await vote_details.create(req.body);

    apiResponse.sucess(res, response, 201);
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
