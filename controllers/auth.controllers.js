//importing modules
const bcrypt = require("bcrypt");
const { Sequelize, QueryTypes } = require("sequelize");
const { users, v_login_aio } = require("../models");
const jwt = require("jsonwebtoken");
const apiResponse = require("./../traits/api-response");
var crypto = require("crypto-js");
const { connectEmployee } = require("../config/connections");

// Assigning users to the variable User
const User = users;

//signing a user up
//hashing users password before its saved to the database with bcrypt
const signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const data = {
      userName,
      email,
      password: await bcrypt.hash(password, 10),
    };
    //saving the user
    const user = await User.create(data);

    //if user details is captured
    //generate token with the user's id and the secretKey in the env file
    // set cookie with the token generated
    if (user) {
      let token = jwt.sign({ id: user.id }, process.env.secretKey, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      //send users details
      apiResponse.sucess(res, user, 201);
    } else {
      apiResponse.error(res, "Details are not correct", 409);
    }
  } catch (e) {
    apiResponse.error(res, e.message, 500);
  }
};

//login authentication
// const testi = async (req, res) => {
//   try {
//     res.setHeader("Content-Type", "application/json");
//     const email = req.body.email;
//     apiResponse.sucess(res, email, 200);
//   } catch (e) {
//     apiResponse.error(res, e.message, 500);
//   }
//   // const response = await users.findAll({ where: { email: 'sample@gmail.com' } });
// };

const login = async (req, res) => {
  try {
    const { nik, password } = req.body;
    //find a user by their lg_nik
    const user = await v_login_aio.findOne({
      attributes: {
        exclude: ['id']
      },
      where: {
        lg_nik: nik,
        lg_aktif: 1
      },
    });

    //if user email is found, compare password with bcrypt
    if (user) {
      const isSame = await bcrypt.compare(password, user.password);
      console.log(isSame);
      //if password is the same
      //generate token with the user's id and the secretKey in the env file

      if (isSame) {
        let token = jwt.sign({ id: user.id }, process.env.secretKey, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });

        //if password matches wit the one in the database
        //go ahead and generate a cookie for the user
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        //send user data
        apiResponse.sucess(res, { access_token: token, user: user }, 200);
      } else {
        apiResponse.error(res, "Authentication failed", 401);
      }
    } else {
      apiResponse.error(res, "Authentication failed", 401);
    }
  } catch (e) {
    console.log(e);
    apiResponse.error(res, e.message, 500);
  }
};

const signin = async (req, res) => {
  try {
    const { nik, password } = req.body;
    console.log(req.body);
    //find a user by their email
    // const user = await connectEmployee.query(
    //   "SELECT * FROM `aio_employee`.`php_ms_login` WHERE `lg_nik` = $nik AND lg_aktif = '1' LIMIT 1",
    //   { bind: { nik: nik }, type: QueryTypes.SELECT }
    // );
    const user = await v_login_aio.findOne({
      attributes: {
        exclude: ['id']
      },
      where: {
        lg_nik: nik,
        lg_aktif: 1
      },
    });
    // console.log(user);
    //if user email is found, compare password with bcrypt
    if (user) {
      let hash = crypto.MD5(password).toString();
      console.log(hash + " = " + user.lg_password);

      //if password is the same
      //generate token with the user's id and the secretKey in the env file

      if (user.lg_password == hash) {
        let token = jwt.sign({ id: user.lg_nik }, process.env.secretKey, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });

        // res.cookie('jwt', token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        return res.status(200).json({ access_token: token, user: user });
        // apiResponse.sucess(res, {access_token: token, user: user}, 200);
      } else {
        return res.status(401).json("Authentication Invalid");
      }
    } else {
      return res.status(401).json("User Not Found");
      // apiResponse.error(res, 'Authentication failed', 401);
    }
    // res.status(200).json(user);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

module.exports = {
  signup,
  login,
  signin,
};
