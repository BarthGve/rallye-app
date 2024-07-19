<template>
  <div class="landing-view">
    <h1>Welcome to Our Application</h1>
    <p>Please sign in or register to continue.</p>
    <router-link to="/login">
      <button class="button">Login</button>
    </router-link>
    <router-link to="/register">
      <button class="button">Register</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "LandingView",
};
</script>

<style scoped>
.landing-view {
  text-align: center;
  margin-top: 50px;
}
.button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
