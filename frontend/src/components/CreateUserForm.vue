<template>
  <div class="create-user-form">
    <h2>Create New User</h2>
    <form @submit.prevent="createUser">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <div>
        <label for="role">Role:</label>
        <select v-model="role" id="role" required>
          <option value="joueur">Joueur</option>
          <option value="organisateur">Organisateur</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit">Create User</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: "CreateUserForm",
  data() {
    return {
      email: "",
      password: "",
      role: "joueur",
      error: null,
    };
  },
  methods: {
    async createUser() {
      this.error = null;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/register-user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: this.email,
              password: this.password,
              role: this.role,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "An error occurred");
        }

        alert("User created successfully");
        this.email = "";
        this.password = "";
        this.role = "joueur";
        this.$emit("user-created"); // Emettre un événement pour notifier la création d'un utilisateur
      } catch (error) {
        this.error = error.message;
      }
    },
  },
};
</script>

<style scoped>
.create-user-form {
  max-width: 400px;
  margin: auto;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
