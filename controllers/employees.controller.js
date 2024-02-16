const { Sequelize, QueryTypes } = require("sequelize");
const { connectEmployee } = require("../config/connections");
const { v_login_aio } = require("../models");
const apiResponse = require("../traits/api-response");

exports.index = async (req, res) => {
  try {
    const response = await v_login_aio.findAll({
      attributes: { exclude: ["id"] },
    });

    apiResponse.sucess(res, response, 200);

    // });
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
exports.index = async (req, res) => {
  try {
    const response = await v_login_aio.findAll({
      attributes: { exclude: ["id"] },
    });

    apiResponse.sucess(res, response, 200);

    // });
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};
exports.employeesEmail = async (req, res) => {
  try {
    let response = [];
    const empMail = await connectEmployee.query(
      "SELECT lg_email_aio FROM `aio_employee`.`php_ms_login` WHERE lg_aktif = 1 ",
      { type: QueryTypes.SELECT }
    );
    empMail.forEach((element) => {
      response.push(element.mail_id);
    });
    // const emp = await connectEmploye.query('SELECT * FROM `aio_employee`.`mst_employment` LIMIT 20) ', { type: QueryTypes.SELECT });

    res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
exports.employeesNameEmail = async (req, res) => {
  try {
    let response = [];
    const emp = await connectEmployee.query(
      "SELECT lg_nik,lg_email_aio,lg_name FROM `aio_employee`.`php_ms_login` WHERE lg_aktif = 1 ",
      { type: QueryTypes.SELECT }
    );
    // console.log(emp);
    // console.log(emp);
    emp.forEach((element) => {
      response.push([
        element.lg_email_aio,
        element.lg_name,
        Number(element.lg_nik),
      ]);
    });
    // const emp = await connectEmploye.query('SELECT * FROM `aio_employee`.`mst_employment` LIMIT 20) ', { type: QueryTypes.SELECT });
    // console.log(response);
    res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
exports.employeesM2Up = async (req, res) => {
  try {
    let response = [];
    const emp = await connectEmployee.query(
      "SELECT e.grade_id, e.employee_name,e.mail_id, e.org_locn_work_desc, e.position_desc, e.job_grade_code,e.date_of_birth, e.date_of_join FROM `aio_employee`.`mst_employment` AS e INNER JOIN `aio_employee`.`mst_grade` AS g ON e.grade_id = g.id WHERE g.`level` <= 4  AND e.is_active = 1",
      { type: QueryTypes.SELECT }
    );
    // emp.forEach((element) => {
    //   response.push([element.mail_id, element.employee_name]);
    // });
    // const emp = await connectEmploye.query('SELECT * FROM `aio_employee`.`mst_employment` LIMIT 20) ', { type: QueryTypes.SELECT });

    res.status(200).json(emp);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
