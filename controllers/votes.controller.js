const Validator = require("fastest-validator");
const v = new Validator();
const {
  votes,
  vote_details,
  vote_times,
  vote_participants,
} = require("../models");
// let { startOfDay, endOfDay, parseISO } = require('date-fns');
const apiResponse = require("../traits/api-response");
const voteDetailsController = require("./vote_details.controller");
const { Op } = require("sequelize");

exports.index = async (req, res) => {
  try {
    const response = await votes.findAll({
      include: [{ model: vote_details, include: [vote_times] }],
    });

    apiResponse.sucess(res, response, 200);

    // });
  } catch (e) {
    console.log(e);
    apiResponse.error(res, e.message, 500);
  }
};
exports.indexById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await votes.findAll({
      where: { id: id },
      include: [{ model: vote_details, include: [vote_times] }],
    });

    apiResponse.sucess(res, response, 200);

    // });
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
exports.indexByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await votes.findAll({ where: { userId: userId } });

    apiResponse.sucess(res, response, 200);

    // });
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};

exports.store = async (req, res) => {
  try {
    const response = await votes.create(req.body);
    //   voteDetailsController.store()
    apiResponse.sucess(res, response, 201);
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};

exports.destroy = async (req, res) => {
  try {
    const id = req.params.id;
    let vote = await votes.findByPk(id);
    let voteD = await vote_details.findAll({ where: { voteId: id } });
    voteD.forEach(async (element, i) => {
      // console.log(element.dataValues.id);
      let voteDetailId = element.dataValues.id;
      let voteT = await vote_times.findAll({
        where: { voteDetailId: voteDetailId },
      });
      if (i != voteD.length - 1) {
        await vote_times.destroy({ where: { voteDetailId: voteDetailId } });
      } else {
        await vote_times.destroy({ where: { voteDetailId: voteDetailId } });
        await vote_participants.destroy({ where: { voteId: id } });
        await vote_details.destroy({ where: { voteId: id } });
        await vote.destroy(id);
      }
    });

    // .then((id)=>{
    //   console.log(id);
    // })
    // let vote = await events.findByPk(id);

    // if (!vote) {
    //   apiResponse.sucess(res, "Data is not found!", 203);
    // }
    res.status(200).json({ message: "Data was deleted!" });
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
