const Validator = require('fastest-validator');
const v = new Validator();
const { vote_details } = require('../models');
// let { startOfDay, endOfDay, parseISO } = require('date-fns');
const apiResponse = require('../traits/api-response');
const { Op } = require('sequelize');

exports.index = async (req, res) => {
	try {
		const response = await vote_details.findAll({ attributes: ['voteId'] });

		apiResponse.sucess(res, response, 200);

		// });
	} catch (e) {
		apiResponse.error(res, e.message, 500);
	}
};
exports.store = async (req, res) => {
	try {
		const data = req.body
		console.log(req.body);
		let response = [] 
		data.forEach(element => {
			response.push(vote_details.create(element, { fields: ['voteId', 'date','userId','agree'] })) 

		});
	//   const response = await vote_details.create(req.body);
  
	  apiResponse.sucess(res, response, 201);
	} catch (e) {
	  apiResponse.error(res, e.message, 500);
	}
  };
