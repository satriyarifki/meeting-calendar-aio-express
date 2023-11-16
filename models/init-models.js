var DataTypes = require("sequelize").DataTypes;
var _vote_details = require("./vote_details");
var _votes = require("./votes");

function initModels(sequelize) {
  var vote_details = _vote_details(sequelize, DataTypes);
  var votes = _votes(sequelize, DataTypes);

  vote_details.belongsTo(votes, { as: "votes", foreignKey: "voteId"});
  votes.hasMany(vote_details, { as: "vote_details", foreignKey: "voteId"});

  return {
    vote_details,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
