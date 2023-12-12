'use strict';
const Sequelize = require('sequelize');
// const { vote_details,votes } = require('../models');
module.exports = function(sequelize, DataTypes) {
  const Votes = sequelize.define('votes', { timestamps: false });
  const Vote_time =  sequelize.define('vote_times', {timestamps:false})
  const Vote_parcitipant =  sequelize.define('vote_parcitipants', {timestamps:false})
  const Vote_details = sequelize.define('vote_details', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    voteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vote',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    }
  }, {
    tableName: 'vote_details',
    timestamps: false,
    
  });
  Vote_details.belongsTo(Votes);
  Vote_details.hasMany(Vote_time);
  Vote_details.hasMany(Vote_parcitipant);
  return Vote_details
};
