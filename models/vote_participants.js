const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Vote = sequelize.define('votes', {timestamps :false})
  const Vote_participants = sequelize.define('vote_participants', {
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
        model: 'votes',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'vote_participants',
    timestamps: false,
    indexes: [
      {
        name: "FK_vote_participants_vote",
        using: "BTREE",
        fields: [
          { name: "voteId" },
        ]
      },
    ]
  });
  Vote_participants.belongsTo(Vote);
  return Vote_participants
};
