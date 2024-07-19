<template>
  <div class="login">
    <h2>Login</h2>
    <form class="p-4" @submit.prevent="loginUser">
      <div>
        <label for="email">Email:</label>
        <InputText type="text" v-model="email" id="email" />
      </div>
      <div>
        <label for="password">Password:</label>
        <Password id="password" v-model="password" toggleMask />
      </div>
      <Button class="m-4" type="submit" label="Login" />
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
        localStorage.setItem("role", data.role);

        if (data.role === "joueur") {
          this.$router.push("/home");
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
.login {
  max-width: 300px;
  margin: auto;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
