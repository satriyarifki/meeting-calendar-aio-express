const Validator = require('fastest-validator');
const v = new Validator();
const { Sequelize, QueryTypes } = require("sequelize");
const { vote_details,vote_times } = require('../models');
// let { startOfDay, endOfDay, parseISO } = require('date-fns');
const apiResponse = require('../traits/api-response');
const { Op } = require('sequelize');

exports.index = async (req, res) => {
	try {
		const response = await vote_times.findAll({ attributes:{exclude: ['id']} , include:[{model:vote_details}] });

		apiResponse.sucess(res, response, 200);

		// });
	} catch (e) {
		apiResponse.error(res, e.message, 500);
	}
};

exports.indexIn = async (req, res) => {
	try {
		const response = await vote_times.findAll({ attributes: ['voteDetailId', 'time','agree'],include:[{model:vote_details}] });

		apiResponse.sucess(res, response, 200);

		// });
	} catch (e) {
        console.log(e);
		apiResponse.error(res, e.message, 500);
	}
};
exports.store = async (req, res) => {
	try {
		const data = req.body
		// console.log(req.body);
		let response = [] 
		data.forEach(element => {
			response.push(vote_times.create(element, { fields: ['voteDetailId', 'time','agree'] })) 
		});
	//   const response = await vote_details.create(req.body);
  
	  apiResponse.sucess(res, response, 201);
	} catch (e) {
	  apiResponse.error(res, e.message, 500);
	}
  };
  exports.update = async (req, res) => {
	try {
		const data = req.body
		// console.log(req.body);
		let response = [] 
		data.forEach(elem => {
			response.push(vote_times.update(elem, { fields: ['agree'], where: {voteDetailId :elem.voteDetailId, date:elem.date,userId:elem.userId}})) 
		});
	//   const response = await vote_details.create(req.body);
  
	  apiResponse.sucess(res, response, 201);
	} catch (e) {
	  apiResponse.error(res, e.message, 500);
	}
  };