<template>
  <AdminLayout>
    <div class="admin-home-view">
      <h1>Welcome to the Admin Home Page</h1>
      <p>This page is accessible only to authenticated admins.</p>
      <div v-if="user">
        <p>Email: {{ user.email }}</p>
        <p>Role: {{ user.role }}</p>
      </div>

      <div class="flex space-x-4 justify-center mt-6">
        <Card class="w-1/4">
          <template #title>Total Players</template>
          <template #content>
            <p class="m-0">{{ playerCount }}</p>
          </template>
        </Card>
        <Card class="w-1/4">
          <template #title>Total Admins</template>
          <template #content>
            <p class="m-0">{{ adminCount }}</p>
          </template>
        </Card>
        <Card class="w-1/4">
          <template #title>Total Organizers</template>
          <template #content>
            <p class="m-0">{{ organizerCount }}</p>
          </template>
        </Card>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from "../layouts/AdminLayout.vue";
import Card from "primevue/card";

export default {
  name: "AdminHomeView",
  components: {
    AdminLayout,
    Card,
  },
  data() {
    return {
      user: null,
      playerCount: null,
      adminCount: null,
      organizerCount: null,
      error: null,
    };
  },
  created() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        this.user = {
          email: decoded.email,
          role: decoded.role,
        };
        this.updateCounts();
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem("token");
        this.$router.push("/login");
      }
    } else {
      this.$router.push("/login");
    }
  },
  methods: {
    async updateCounts() {
      const token = localStorage.getItem("token");
      await this.fetchPlayerCount(token);
      await this.fetchAdminCount(token);
      await this.fetchOrganizerCount(token);
    },
    async fetchPlayerCount(token) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/player-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch player count");
        }
        const data = await response.json();
        this.playerCount = data.count;
      } catch (error) {
        this.error = error.message;
      }
    },
    async fetchAdminCount(token) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/admin-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch admin count");
        }
        const data = await response.json();
        this.adminCount = data.count;
      } catch (error) {
        this.error = error.message;
      }
    },
    async fetchOrganizerCount(token) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/organizer-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch organizer count");
        }
        const data = await response.json();
        this.organizerCount = data.count;
      } catch (error) {
        this.error = error.message;
      }
    },
  },
};
</script>

<style scoped>
.admin-home-view {
  text-align: center;
  margin-top: 50px;
}
</style>
