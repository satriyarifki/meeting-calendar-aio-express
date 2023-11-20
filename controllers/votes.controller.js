const Validator = require('fastest-validator');
const v = new Validator();
const { votes } = require('../models');
// let { startOfDay, endOfDay, parseISO } = require('date-fns');
const apiResponse = require('../traits/api-response');
const voteDetailsController = require("./vote_details.controller");
const { Op } = require('sequelize');

exports.index = async (req, res) => {
	try {
		const response = await votes.findAll();

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