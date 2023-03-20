const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");

exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // const existingUser = await User.findOne({
    //   where: {
    //     email: email,
    //   },
    // });
    // if (false) {
    //   return res
    //     .status(400)
    //     .json({ message: "User with this email already exists" });
    // }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    const accessToken = jwt.sign({ userId: newUser.id }, "helloYaluwane");
    res
      .status(201)
      .json({ message: "User created successfully", token: accessToken });
  } catch (err) {
    if (err instanceof Sequelize.ValidationError) {
      const errorObj = {};
      err.errors.forEach((error) => {
        errorObj[error.path] = error.message;
      });
      return res.status(400).json({ success: false, errors: errorObj });
    }
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the user",
    });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      return res
        .status(400)
        .json({
          errors: {
            username: "Invalid username or password",
            password: "Invalid username or password",
          },
        });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({
          errors: {
            username: "Invalid username or password",
            password: "Invalid username or password",
          },
        });
    }
    const accessToken = jwt.sign({ userId: user.id }, "mmmm");
    res.json({ message: "Login successful", accessToken, user });
  } catch (err) {
    next(err);
  }
};
