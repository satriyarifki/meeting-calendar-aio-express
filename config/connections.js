const Sequelize = require('sequelize');
const config = require('./config');

const connectDevelopment = new Sequelize(config.production.database, config.production.username, config.production.password, config.production);
const connectEmployee = new Sequelize(config.aioEmployee.database, config.aioEmployee.username, config.aioEmployee.password, config.aioEmployee);
const connectMris = new Sequelize(config.mris.database, config.mris.username, config.mris.password, config.mris);
const connectMataHo = new Sequelize(config.ho_mata.database, config.ho_mata.username, config.ho_mata.password, config.ho_mata);

module.exports = {
	connectDevelopment,
	connectEmployee,
	connectMris,
	connectMataHo,
};