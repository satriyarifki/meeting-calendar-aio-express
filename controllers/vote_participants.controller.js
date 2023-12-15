const Validator = require('fastest-validator');
const v = new Validator();
const { Sequelize, QueryTypes } = require("sequelize");
const { vote_participants,votes } = require('../models');
// let { startOfDay, endOfDay, parseISO } = require('date-fns');
const apiResponse = require('../traits/api-response');
const { Op } = require('sequelize');
const vote_details = require('../models/vote_details');


exports.index = async (req, res) => {
	try {
		const response = await vote_participants.findAll({ attributes:{exclude: ['id']} });

		apiResponse.sucess(res, response, 200);

		// });
	} catch (e) {
		apiResponse.error(res, e.message, 500);
	}
};

exports.store = async (req, res) => {
    try {
      let response = []
      const {voteId, array} = req.body
      array.forEach(async elem => {
         response.push(await vote_participants.create({voteId:voteId, userId:elem.userId}));
        
      });
      //   voteDetailsController.store()
      apiResponse.sucess(res, response, 201);
    } catch (e) {
      apiResponse.error(res, e.message, 500);
    }
  };