<template>
  <div class="register">
    <h2>Register</h2>
    <form class="p-4" @submit.prevent="registerUser">
      <div>
        <label for="email">Email:</label>
        <InputText
          type="text"
          v-model="email"
          id="email"
          @blur="validateEmail"
        />
        <div v-if="emailError" class="error">{{ emailError }}</div>
      </div>
      <div>
        <label for="password">Password:</label>
        <Password id="password" v-model="password" toggleMask />
      </div>
      <div>
        <input type="checkbox" id="terms" v-model="acceptedTerms" />
        <label for="terms">
          J'ai pris connaissance des conditions de collectes et d'utilisation de
          mes données personnelles.
        </label>
      </div>
      <Button
        class="m-4"
        type="submit"
        label="Enregistrer"
        :disabled="!acceptedTerms"
      />
    </form>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      acceptedTerms: false,
      error: "",
      emailError: "",
    };
  },
  methods: {
    async registerUser() {
      this.error = "";

      // Valider l'email lors de la soumission du formulaire
      if (!this.validateEmail()) {
        return;
      }

      // Valider le mot de passe
      if (!this.validatePassword(this.password)) {
        this.error =
          "Le mot de passe doit contenir au moins 12 caractères, dont une majuscule, un caractère spécial et un chiffre.";
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: this.email,
              password: this.password,
              acceptedTerms: this.acceptedTerms,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "An error occurred");
        }

        alert("User registered successfully");
        this.email = "";
        this.password = "";
        this.acceptedTerms = false;
      } catch (error) {
        this.error = error.message;
      }
    },
    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.emailError = emailPattern.test(this.email)
        ? ""
        : "L'adresse email n'est pas valide.";
      return !this.emailError;
    },
    validatePassword(password) {
      const minLength = 12;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

      return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar
      );
    },
  },
};
</script>

<style scoped>
.register {
  max-width: 300px;
  margin: auto;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
