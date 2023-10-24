require("dotenv").config();
module.exports = {
  development: {
    username: "root",
    password: null,
    database: "meeting_calendar_aio",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  aioEmployee: {
    username: "iot_prod",
    password: "123456",
    database: "aio_employee",
    host: "192.168.9.47",
    port: "3306",
    dialect: "mysql",
  },
  mris: {
    username: "iot_prod",
    password: "123456",
    database: "mris_database",
    host: "192.168.9.47",
    port: "3306",
    dialect: "mysql",
    timezone: "+07:00",
  },
  production: {
    username: "iot_prod",
    password: "123456",
    database: "meeting_calendar_aio",
    host: "192.168.9.47",
    dialect: "mysql",
  },
  ho_mata: {
    username: "internkjy",
    password: "internkjy",
    database: "mata",
    host: "192.168.1.195",
    port: "3307",
    dialect: "mysql",
    timezone: "+07:00",
  },
};
