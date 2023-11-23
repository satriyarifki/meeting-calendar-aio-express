'use strict';
const Sequelize = require('sequelize');
// const { vote_details,votes } = require('../models');
module.exports = function(sequelize, DataTypes) {
  const Votes = sequelize.define('votes', { timestamps: false });
  const Vote_details = sequelize.define('vote_details', {
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
    agree: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
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
  return Vote_details
};
