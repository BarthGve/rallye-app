<template>
  <div class="home-view">
    <h1>Welcome to the Home Page</h1>
    <p>This page is accessible only to authenticated users.</p>
    <button @click="logout" class="logout-button">Logout</button>

    <div v-if="user">
      <p>Email: {{ user.email }}</p>
      <p>Role: {{ user.role }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
      user: null,
    };
  },
  created() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        this.user = {
          email: decoded.email,
          role: decoded.role,
        };
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token");
        this.$router.push("/login");
      }
    } else {
      this.$router.push("/login");
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.home-view {
  text-align: center;
  margin-top: 50px;
}
.logout-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ff4b5c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
