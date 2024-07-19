<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/register">Register</router-link>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style scoped>
nav {
  display: flex;
  gap: 10px;
}
</style>
