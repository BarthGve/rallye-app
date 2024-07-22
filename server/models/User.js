const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {},
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "joueur",
  },
  acceptedTerms: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Valeur par défaut pour acceptedTerms
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date_de_naissance: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = User;
