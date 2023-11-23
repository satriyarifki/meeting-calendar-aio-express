const Validator = require('fastest-validator');
const v = new Validator();
const { vote_details,votes } = require('../models');
// let { startOfDay, endOfDay, parseISO } = require('date-fns');
const apiResponse = require('../traits/api-response');
const { Op } = require('sequelize');

exports.index = async (req, res) => {
	try {
		const response = await vote_details.findAll({ attributes: ['voteId','date','userId','agree'] });

		apiResponse.sucess(res, response, 200);

		// });
	} catch (e) {
		apiResponse.error(res, e.message, 500);
	}
};
exports.indexByVote = async (req, res) => {
	try {
		const {voteId} = req.params
		const response = await vote_details.findAll({ attributes: ['voteId','date','userId','agree'],where:{voteId: voteId} });

		apiResponse.sucess(res, response, 200);

		// });
	} catch (e) {
		apiResponse.error(res, e.message, 500);
	}
};
exports.indexGroupedByVote = async (req, res) => {
	try {
		const {userId} = req.params
		const response = await vote_details.findAll({ attributes: ['voteId','date','userId','agree'],where:{userId: userId}, group:['voteId'],include: [{model:votes}] });

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
exports.update = async (req, res) => {
	try {
		const data = req.body
		console.log(req.body);
		let response = [] 
		data.forEach(elem => {
			response.push(vote_details.update(elem, { fields: ['agree'], where: {voteId :elem.voteId, date:elem.date,userId:elem.userId,}})) 
		});
	//   const response = await vote_details.create(req.body);
  
	  apiResponse.sucess(res, response, 201);
	} catch (e) {
	  apiResponse.error(res, e.message, 500);
	}
  };
