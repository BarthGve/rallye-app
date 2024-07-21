<template>
  <div class="landing-view">
    <div
      class="bg-cover bg-center min-h-screen flex items-center justify-center text-white px-4 sm:px-6 background-image: url(''../assets/image/landing_background.png') background-size: cover background-position: center display: flex align-items: center justify-content: center"
    >
      <div
        class="bg-black bg-opacity-50 p-6 sm:p-10 rounded-lg text-center shadow-lg w-full sm:w-auto"
      >
        <h1 class="text-3xl sm:text-4xl font-bold mb-4">
          Welcome to Our Rally Application
        </h1>
        <p class="text-xs sm:text-base mb-8">
          Please sign in or register to continue.
        </p>
        <div
          class="flex flex-col sm:flex-row justify-center sm:space-y-0 sm:space-x-4"
        >
          <router-link to="/login">
            <Button
              label="Login"
              class="p-button-rounded p-button-primary w-full sm:w-auto"
            ></Button>
          </router-link>
          <router-link to="/register">
            <Button
              label="Register"
              class="p-button-rounded p-button-secondary w-full sm:w-auto"
            ></Button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LandingView",
};
</script>
<style scoped>
.landing-view {
  background-image: url("../assets/image/landing_background.png");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-cover {
  background-size: cover;
}

.bg-center {
  background-position: center;
}

.bg-gray-800 {
  background-color: #2d3748;
}

.text-white {
  color: #ffffff;
}

.bg-black {
  background-color: #000000;
}

.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}

.p-6 {
  padding: 1.5rem;
}

.sm\:p-10 {
  padding: 2.5rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
}

.sm\:text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.font-bold {
  font-weight: 700;
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.sm\:text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.sm\:flex-row {
  flex-direction: row;
}

.justify-center {
  justify-content: center;
}

.space-y-4 > :not(template) ~ :not(template) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}

.sm\:space-y-0 > :not(template) ~ :not(template) {
  --tw-space-y-reverse: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.sm\:space-x-4 > :not(template) ~ :not(template) {
  --tw-space-x-reverse: 0;
  margin-right: calc(1rem * var(--tw-space-x-reverse));
  margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
}

.w-full {
  width: 100%;
}

.sm\:w-auto {
  width: auto;
}

.min-h-screen {
  min-height: 100vh;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.sm\:px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
</style>
