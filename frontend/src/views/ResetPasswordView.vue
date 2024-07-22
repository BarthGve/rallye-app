<template>
  <div
    class="flex min-h-screen overflow-hidden reset-password-view surface-ground align-items-center justify-content-center min-w-screen"
  >
    <div
      class="flex flex-column align-items-center justify-content-center form-container"
    >
      <div
        class="w-full px-5 py-8 surface-card sm:px-8"
        style="border-radius: 53px"
      >
        <div class="mb-5 text-center">
          <div class="mb-3 text-3xl font-medium text-900">Reset Password</div>
          <span class="font-medium text-600">Enter your new password</span>
        </div>
        <form @submit.prevent="resetPassword">
          <div>
            <label
              for="password"
              class="block mb-2 text-xl font-medium text-900"
              >New Password</label
            >
            <Password
              id="password"
              v-model="password"
              placeholder="New Password"
              :toggleMask="true"
              class="w-full mb-5"
              inputClass="w-full"
              :inputStyle="{ padding: '1rem' }"
              @blur="validatePassword"
              required
            />
            <div
              v-if="passwordError"
              class="mt-2 text-red-600"
              v-html="passwordError"
            ></div>
          </div>
          <Button
            label="Reset Password"
            type="submit"
            class="w-full p-3 text-xl"
          ></Button>
          <div v-if="message" class="mt-4 text-green-600">
            {{ message }}
          </div>
          <div v-if="error" class="mt-4 mb-4 text-center text-red-600">
            {{ error }}
          </div>
        </form>
        <div v-if="message" class="mt-4 text-center">
          <router-link
            to="/login"
            class="font-medium"
            style="color: var(--primary-color)"
            >Go to Login</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from "primevue/button";
import Password from "primevue/password";
import { ref } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "ResetPasswordView",
  components: {
    Password,
    Button,
  },
  setup() {
    const route = useRoute();
    const password = ref("");
    const passwordError = ref("");
    const message = ref("");
    const error = ref("");

    const validatePassword = () => {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
      if (!password.value.match(passwordRegex)) {
        passwordError.value =
          "Password must be at least 12 characters long,<br>contain one uppercase letter, one lowercase letter, one number,<br>and one special character.";
        return false;
      } else {
        passwordError.value = "";
        return true;
      }
    };

    const resetPassword = async () => {
      error.value = "";
      message.value = "";

      if (!validatePassword()) {
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/reset-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: route.params.token,
              password: password.value,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "An error occurred");
        }

        message.value = "Password has been reset. You can now log in.";
      } catch (error) {
        error.value = error.message;
      }
    };

    return {
      password,
      passwordError,
      message,
      error,
      resetPassword,
      validatePassword,
    };
  },
};
</script>

<style scoped>
.form-container {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.reset-password-view {
  background-image: url("../assets/image/landing_background.png");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
