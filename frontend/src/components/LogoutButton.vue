<template>
  <button @click="logout" class="logout-button">Logout</button>
</template>

<script>
export default {
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
.logout-button {
  padding: 10px 20px;
  background-color: #ff4b5c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
