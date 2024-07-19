<template>
  <AdminLayout>
    <div class="admin-user-view">
      <h2 class="text-2xl font-bold mb-4">Utilisateurs en base</h2>
      <UserTable @user-deleted="updateCounts" />
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from "../layouts/AdminLayout.vue";
import UserTable from "../components/UserTable.vue";

export default {
  name: "AdminUserView",
  components: {
    AdminLayout,
    UserTable,
  },
  methods: {
    updateCounts() {
      // Implement logic to update user counts if needed
    },
  },
};
</script>

<style scoped>
.admin-user-view {
  text-align: center;
  margin-top: 50px;
}
</style>
