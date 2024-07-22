// src/utils/generatePassword.js
const generatePassword = () => {
  const length = 12;
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const specialChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  const allChars = lowercase + uppercase + digits + specialChars;

  let password = "";

  // Assurez-vous que le mot de passe contient au moins une majuscule, un chiffre et un caractère spécial
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  // Remplissez le reste du mot de passe avec des caractères aléatoires
  for (let i = 3; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }

  // Mélangez les caractères pour plus de sécurité
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
};

// Exemple d'utilisation
console.log(generatePassword());

module.exports = generatePassword;
