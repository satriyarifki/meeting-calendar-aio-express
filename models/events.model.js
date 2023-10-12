"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("users", { timestamps: false });
  const Rooms = sequelize.define("rooms", { timestamps: false });
  const Attachments = sequelize.define("attachments", { timestamps: false });
  const Participants = sequelize.define("participants", { timestamps: false });
  const Events = sequelize.define(
    "events",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        
      },
      title: {
        type: DataTypes.STRING,
      },
      organizer: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      online_offline: {
        type: DataTypes.ENUM(["Offline", "Online","Hybrid"]),
        defaultValue: "Online",
      },
      url_online: {
        type: DataTypes.STRING,
      },
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "rooms",
          },
          key: "id",
        },
      },
      message: {
        type: DataTypes.STRING,
      },
      date: {
        type: DataTypes.DATE,
      },
      time_start: {
        type: DataTypes.TIME,
      },
      time_end: {
        type: DataTypes.TIME,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "events",
    }
  );

  Events.belongsTo(Users);
  Events.belongsTo(Rooms);
  Events.hasMany(Attachments);
  Events.hasMany(Participants);

  // class events extends Model {
  // 	/**
  // 	 * Helper method for defining associations.
  // 	 * This method is not a part of Sequelize lifecycle.
  // 	 * The `models/index` file will call this method automatically.
  // 	 */
  // 	static associate(models) {
  // 		// define association here
  // 	}
  // }
  // events.init(
  // 	{
  // 		title: DataTypes.STRING,
  // 		organizer: DataTypes.STRING,
  // 		description: DataTypes.STRING,
  // 		online_offline: DataTypes.ENUM,
  // 		url_online: DataTypes.STRING,
  // 		room_id: DataTypes.INTEGER,
  // 		message: DataTypes.STRING,
  // 		date: DataTypes.DATE,
  // 		time_start: DataTypes.TIME,
  // 		time_end: DataTypes.TIME,
  // 	},
  // 	{
  // 		sequelize,
  // 		modelName: 'events',
  // 	}
  // );
  return Events;
};
