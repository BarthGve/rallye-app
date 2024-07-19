const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const User = sequelize.define(
  "User",
  {
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
      validate: {
        len: {
          args: [12, 100], // Minimum 12 caractères
          msg: "Le mot de passe doit contenir au moins 12 caractères.",
        },
        isComplex(value) {
          if (
            !/[A-Z]/.test(value) ||
            !/[a-z]/.test(value) ||
            !/[0-9]/.test(value) ||
            !/[^A-Za-z0-9]/.test(value)
          ) {
            throw new Error(
              "Le mot de passe doit contenir au moins une majuscule, un caractère spécial et un chiffre."
            );
          }
        },
      },
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
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        const bcrypt = require("bcrypt");
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }
);

module.exports = User;
