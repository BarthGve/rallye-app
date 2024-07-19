<template>
  <div class="login-view">
    <h2>Login</h2>
    <form class="p-4" @submit.prevent="loginUser">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async loginUser() {
      this.error = "";

      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: this.email,
              password: this.password,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "An error occurred");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        const decoded = JSON.parse(atob(data.token.split(".")[1]));
        localStorage.setItem("role", decoded.role);

        if (decoded.role === "joueur") {
          this.$router.push("/home");
        } else if (decoded.role === "admin") {
          this.$router.push("/admin-home");
        } else {
          // Rediriger les autres rôles vers une autre page si nécessaire
        }
      } catch (error) {
        this.error = error.message;
      }
    },
  },
};
</script>

<style scoped>
.login-view {
  max-width: 300px;
  margin: auto;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
