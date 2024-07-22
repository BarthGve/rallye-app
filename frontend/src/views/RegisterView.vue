<template>
  <div class="register-view">
    <Register />
  </div>
</template>

<script>
import Register from "../components/Register.vue";

export default {
  components: {
    Register,
  },
};
</script>

<style scoped>
.register-view {
  padding: 20px;
}

.form-container {
  background-color: rgba(
    255,
    255,
    255,
    0.9
  ); /* White background with transparency */
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Light shadow for better contrast */
}
</style>
