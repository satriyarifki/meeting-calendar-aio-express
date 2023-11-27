const Validator = require("fastest-validator");
const v = new Validator();
const { votes } = require("../models");
// let { startOfDay, endOfDay, parseISO } = require('date-fns');
const apiResponse = require("../traits/api-response");
const voteDetailsController = require("./vote_details.controller");
const { Op } = require("sequelize");

exports.index = async (req, res) => {
  try {
    const response = await votes.findAll();

    apiResponse.sucess(res, response, 200);

    // });
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
exports.indexById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await votes.findAll({ where: { id: id } });

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
