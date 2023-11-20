const { Sequelize, QueryTypes } = require("sequelize");
const { connectEmployee } = require("../config/connections");

exports.employeesEmail = async (req, res) => {
  try {
    let response = [];
    const empMail = await connectEmployee.query(
      "SELECT mail_id FROM `aio_employee`.`mst_employment`WHERE is_active = 1 ",
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
      "SELECT employee_code,mail_id,employee_name FROM `aio_employee`.`mst_employment`WHERE is_active = 1 ",
      { type: QueryTypes.SELECT }
    );
    // console.log(emp);
    emp.forEach((element) => {
      response.push([element.mail_id, element.employee_name,Number(element.employee_code)]);
    });
    // const emp = await connectEmploye.query('SELECT * FROM `aio_employee`.`mst_employment` LIMIT 20) ', { type: QueryTypes.SELECT });

    res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
exports.employeesM2Up = async (req, res) => {
  try {
    let response = [];
    const emp = await connectEmployee.query(
      "SELECT e.grade_id, e.employee_name,e.mail_id, e.org_locn_work_desc, e.position_desc, e.job_grade_code,e.date_of_birth, e.date_of_join FROM `aio_employee`.`mst_employment` AS e INNER JOIN `aio_employee`.`mst_grade` AS g ON e.grade_id = g.id WHERE g.`level` <= 4 ",
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


