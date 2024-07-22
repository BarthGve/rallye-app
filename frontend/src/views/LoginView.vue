<template>
  <div
    class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
  >
    <div
      class="flex flex-column align-items-center justify-content-center form-container"
    >
      <div
        class="w-full surface-card py-8 px-5 sm:px-8"
        style="border-radius: 53px"
      >
        <div class="text-center mb-5">
          <div class="text-900 text-3xl font-medium mb-3">Welcome!</div>
          <span class="text-600 font-medium">Sign in to continue</span>
        </div>

        <form @submit.prevent="loginUser">
          <div>
            <label for="email" class="block text-900 text-xl font-medium mb-2"
              >Email</label
            >
            <InputText
              id="email"
              type="email"
              placeholder="Email address"
              class="w-full md:w-30rem mb-5"
              style="padding: 1rem"
              v-model="email"
              required
            />
          </div>
          <div>
            <label
              for="password"
              class="block text-900 text-xl font-medium mb-2"
              >Password</label
            >
            <Password
              id="password"
              v-model="password"
              placeholder="Password"
              :toggleMask="true"
              class="w-full mb-3"
              inputClass="w-full"
              :inputStyle="{ padding: '1rem' }"
              required
            />
          </div>
          <div
            class="flex align-items-center justify-content-between mb-5 gap-5"
          >
            <div class="flex align-items-center">
              <Checkbox
                v-model="checked"
                id="rememberme"
                binary
                class="mr-2"
              ></Checkbox>
              <label for="rememberme">Remember me</label>
            </div>
            <a
              class="font-medium no-underline ml-2 text-right cursor-pointer"
              style="color: var(--primary-color)"
              @click="goToForgotPassword"
              >Forgot password?</a
            >
          </div>
          <Button
            label="Sign In"
            type="submit"
            class="w-full p-3 text-xl"
          ></Button>
          <div v-if="error" class="text-red-600 mt-4">{{ error }}</div>
        </form>
        <div class="text-center mt-4">
          <span class="text-600">Don't have an account? </span>
          <router-link
            to="/register"
            class="font-medium"
            style="color: var(--primary-color)"
            >Create one</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import Password from "primevue/password";

export default {
  name: "LoginView",
  components: {
    InputText,
    Password,
    Checkbox,
    Button,
  },
  data() {
    return {
      email: "",
      password: "",
      checked: false,
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
        const decoded = JSON.parse(atob(data.token.split(".")[1]));
        localStorage.setItem("role", decoded.role);

        if (decoded.role === "joueur") {
          this.$router.push("/home");
        } else if (decoded.role === "admin") {
          this.$router.push("/admin-home");
        } else {
          // Rediriger les autres rôles vers une autre page si nécessaire
        }
      } catch (error) {
        this.error = error.message;
      }
    },
    goToForgotPassword() {
      this.$router.push("/forgot-password");
    },
  },
};
</script>
<style scoped>
.surface-ground {
  background-image: url("../assets/image/landing_background.png");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
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

.text-900 {
  color: #212121;
}

.text-600 {
  color: #757575;
}
</style>
