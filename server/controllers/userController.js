const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const sendEmail = require("../utils/sendMail");
const generatePassword = require("../utils/generatePassword");

exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      acceptedTerms,
      nom,
      prenom,
      genre,
      date_de_naissance,
    } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      acceptedTerms,
      nom,
      prenom,
      genre,
      date_de_naissance,
    });
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Email is already in use" });
    }
    res.status(400).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, role, nom, prenom, genre, date_de_naissance } = req.body;

    // Vérifiez si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    // Générer un mot de passe sécurisé
    const password = generatePassword();

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer le nouvel utilisateur
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      nom,
      prenom,
      genre,
      date_de_naissance,
    });

    // Envoyer un email de confirmation
    await sendEmail({
      to: email,
      subject: "Votre compte a été créé",
      text: `Bonjour ${prenom},\n\nVotre compte a été créé avec succès. Voici votre mot de passe : ${password}\n\nVeuillez le changer après votre première connexion.\n\nCordialement,\nL'équipe.`,
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// exports.createUser = async (req, res) => {
//   try {
//     const { email, role, nom, prenom, genre, date_de_naissance } = req.body;

//     // Vérifiez si l'utilisateur existe déjà
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email is already in use" });
//     }

//     // Générer un mot de passe sécurisé
//     const password = generatePassword();

//     // Hacher le mot de passe
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Créer le nouvel utilisateur
//     const newUser = await User.create({
//       email,
//       password: hashedPassword,
//       role,
//       nom,
//       prenom,
//       genre,
//       date_de_naissance,
//     });

//     await sendEmail({
//       to: email,
//       subject: "Votre compte a été créé",
//       text: `Bonjour ${prenom},\n\nVotre compte a été créé avec succès. Voici votre mot de passe : ${password}\n\nVeuillez le changer après votre première connexion.\n\nCordialement,\nL'équipe.`,
//     });

//     res
//       .status(201)
//       .json({ message: "User created successfully", user: newUser });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        nom: user.nom,
        prenom: user.prenom,
      },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, nom, prenom, genre, date_de_naissance } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role || user.role;
    user.nom = nom || user.nom;
    user.prenom = prenom || user.prenom;
    user.genre = genre || user.genre;
    user.date_de_naissance = date_de_naissance || user.date_de_naissance;
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPlayerCount = async (req, res) => {
  try {
    const playerCount = await User.count({ where: { role: "joueur" } });
    res.status(200).json({ count: playerCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrganizerCount = async (req, res) => {
  try {
    const organizerCount = await User.count({
      where: { role: "organisateur" },
    });
    res.status(200).json({ count: organizerCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAdminCount = async (req, res) => {
  try {
    const adminCount = await User.count({ where: { role: "admin" } });
    res.status(200).json({ count: adminCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "email",
        "role",
        "nom",
        "prenom",
        "genre",
        "date_de_naissance",
        "createdAt",
        "updatedAt",
        "password",
      ],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.destroy({ where: { id: userId } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPlayerGenderCounts = async (req, res) => {
  try {
    const maleCount = await User.count({
      where: { role: "joueur", genre: "M" },
    });
    const femaleCount = await User.count({
      where: { role: "joueur", genre: "F" },
    });

    res.status(200).json({ maleCount, femaleCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer le joueur le plus jeune
exports.getYoungestPlayer = async (req, res) => {
  try {
    const youngestPlayer = await User.findAll({
      where: { role: "joueur" },
      order: [["date_de_naissance", "DESC"]],
      limit: 1, // Limiter à un seul résultat
    });

    if (!youngestPlayer || youngestPlayer.length === 0) {
      return res.status(404).json({ message: "Aucun joueur trouvé" });
    }

    res.status(200).json(youngestPlayer[0]); // Renvoyer le premier (et unique) joueur trouvé
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer le joueur le plus âgé
exports.getOldestPlayer = async (req, res) => {
  try {
    const oldestPlayer = await User.findAll({
      where: { role: "joueur" },
      order: [["date_de_naissance", "ASC"]],
      limit: 1, // Limiter à un seul résultat
    });

    if (!oldestPlayer || oldestPlayer.length === 0) {
      return res.status(404).json({ message: "Aucun joueur trouvé" });
    }

    res.status(200).json(oldestPlayer[0]); // Renvoyer le premier (et unique) joueur trouvé
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPlayersByAgeRange = async (req, res) => {
  try {
    const ageRanges = [
      { label: "0-10", min: 0, max: 10 },
      { label: "11-20", min: 11, max: 20 },
      { label: "21-30", min: 21, max: 30 },
      { label: "31-40", min: 31, max: 40 },
      { label: "41-50", min: 41, max: 50 },
      { label: "51-60", min: 51, max: 60 },
      { label: "61+", min: 61, max: 120 }, // Supposons que l'âge maximum est 150 ans
    ];

    const currentDate = new Date();
    const playersByAgeRange = await Promise.all(
      ageRanges.map(async (range) => {
        const minDate = new Date(
          currentDate.getFullYear() - range.max,
          currentDate.getMonth(),
          currentDate.getDate()
        );
        const maxDate = new Date(
          currentDate.getFullYear() - range.min,
          currentDate.getMonth(),
          currentDate.getDate()
        );

        const count = await User.count({
          where: {
            role: "joueur",
            date_de_naissance: {
              [Op.between]: [minDate, maxDate],
            },
          },
        });

        return {
          label: range.label,
          count: count,
        };
      })
    );

    res.status(200).json(playersByAgeRange);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLastFiveUsers = async (req, res) => {
  try {
    const lastFiveUsers = await User.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      attributes: ["nom", "prenom", "date_de_naissance", "genre", "createdAt"],
    });

    res.status(200).json(lastFiveUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await User.findAll({
      where: { role },
      attributes: ["nom", "prenom", "date_de_naissance", "email", "genre"],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      text:
        `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `http://localhost:5173/reset-password/${token}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset link sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Password has been reset." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
