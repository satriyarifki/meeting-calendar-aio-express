'use strict';
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Vote_details = sequelize.define('vote_details', { timestamps: false });
  const Vote = sequelize.define('votes', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    desc: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    }
  }, {
    tableName: 'votes',
    timestamps: true,
    
  });
  Vote.hasMany(Vote_details)
  return Vote
};
