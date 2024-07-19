const { sequelize } = require("../models");

exports.testConnection = async (req, res) => {
  try {
    await sequelize.authenticate();
    res
      .status(200)
      .json({ message: "Connection has been established successfully." });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Unable to connect to the database",
        error: error.message,
      });
  }
};
