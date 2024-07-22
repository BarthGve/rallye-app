<template>
  <div
    class="flex min-h-screen overflow-hidden forgot-password-view surface-ground align-items-center justify-content-center min-w-screen"
  >
    <div
      class="flex flex-column align-items-center justify-content-center form-container"
    >
      <div
        class="w-full px-5 py-8 surface-card sm:px-8"
        style="border-radius: 53px"
      >
        <div class="mb-5 text-center">
          <div class="mb-3 text-3xl font-medium text-900">Forgot Password?</div>
          <span class="font-medium text-600"
            >Enter your email to reset your password</span
          >
        </div>
        <form @submit.prevent="sendResetLink">
          <div>
            <label for="email" class="block mb-2 text-xl font-medium text-900"
              >Email</label
            >
            <InputText
              id="email"
              type="email"
              placeholder="Email address"
              class="w-full mb-5 md:w-30rem"
              style="padding: 1rem"
              v-model="email"
              required
            />
          </div>
          <Button
            label="Send Reset Link"
            type="submit"
            class="w-full p-3 text-xl"
          ></Button>
          <div v-if="message" class="mt-4 text-green-600">{{ message }}</div>
          <div v-if="error" class="mt-4 text-red-600">{{ error }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Button from "primevue/button";
import InputText from "primevue/inputtext";

export default {
  name: "ForgotPasswordView",
  components: {
    InputText,
    Button,
  },
  data() {
    return {
      email: "",
      message: "",
      error: "",
    };
  },
  methods: {
    async sendResetLink() {
      this.error = "";
      this.message = "";

      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/forgot-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: this.email,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "An error occurred");
        }

        this.message = "Reset link sent. Please check your email.";
      } catch (error) {
        this.error = error.message;
      }
    },
  },
};
</script>

<style scoped>
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
.forgot-password-view {
  background-image: url("../assets/image/landing_background.png");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Mêmes styles que ceux de LoginView.vue */
</style>

<!-- 
<style scoped>
.surface-ground {

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

.text-900 {
  color: #212121;
}

.text-600 {
  color: #757575;
}
</style> -->
