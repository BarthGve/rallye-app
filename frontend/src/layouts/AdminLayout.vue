<template>
  <div class="admin-layout">
    <header class="header">
      <div class="left">Panneau d'administration</div>
      <div class="right" @click="toggleDropdown">
        {{ user.email }}
        <div v-if="showDropdown" class="dropdown-menu">
          <button @click="logout">Logout</button>
        </div>
      </div>
    </header>
    <div class="main-content">
      <aside class="sidebar">
        <AdminMenu :user="user" />
      </aside>
      <main class="content">
        <slot :user="user"></slot>
      </main>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import AdminMenu from "../components/AdminMenu.vue";
import { useRouter } from "vue-router";

export default {
  components: {
    AdminMenu,
  },
  setup() {
    const user = ref(null);
    const showDropdown = ref(false);
    const router = useRouter();

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value;
    };

    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      router.push("/");
    };

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        user.value = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          nom: decoded.nom,
          prenom: decoded.prenom,
        };
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    } else {
      router.push("/login");
    }

    return {
      user,
      showDropdown,
      toggleDropdown,
      logout,
    };
  },
};
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

.dropdown-menu {
  position: absolute;
  top: 30px;
  right: 0;
  background-color: white;
  color: black;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-menu button {
  background: none;
  border: none;
  color: black;
  padding: 10px;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.dropdown-menu button:hover {
  background-color: #f4f4f4;
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
