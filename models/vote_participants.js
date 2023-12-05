const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vote_participants', {
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
};
