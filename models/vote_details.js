const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vote_details', {
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
    submit: {
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
    sequelize,
    tableName: 'vote_details',
    timestamps: false,
    indexes: [
      {
        name: "FK_vote_details_vote",
        using: "BTREE",
        fields: [
          { name: "voteId" },
        ]
      },
    ]
  });
};
