const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Vote_details = sequelize.define('vote_details', {timestamps :false})
  const Vote_time =  sequelize.define('vote_times', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    voteDetailId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'vote_details',
        key: 'id'
      }
    },
    time: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    agree: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'vote_times',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "FK__votes",
        using: "BTREE",
        fields: [
          { name: "voteDetailId" },
        ]
      },
    ]
  });
  Vote_time.belongsTo(Vote_details);
  return Vote_time
};
