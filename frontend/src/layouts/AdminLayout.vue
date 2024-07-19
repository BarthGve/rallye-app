<template>
  <div class="admin-layout">
    <header class="header">
      <div class="left">Panneau d'administration</div>
    </header>
    <div class="main-content">
      <aside class="sidebar">
        <AdminMenu :user="user" />
      </aside>
      <main class="content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AdminMenu from "../components/AdminMenu.vue";

const user = ref(null);

const token = localStorage.getItem("token");
if (token) {
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    user.value = {
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
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #333;
  color: white;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
}

.left {
  font-size: 20px;
  font-weight: bold;
}

.right {
  position: relative;
  font-size: 16px;
  cursor: pointer;
}

.main-content {
  display: flex;
  flex: 1;
  margin-top: 30px; /* Adjust this value based on the header height */
}

.sidebar {
  width: 280px;
  padding: 20px;
  position: fixed;
  top: 90px;
  margin-top: 10px; /* Adjust this value based on the header height */
  bottom: 0;
  overflow-y: auto;
}

.content {
  flex: 1;
  margin-left: 280px;
  padding: 20px;
  overflow-y: auto;
}
</style>
