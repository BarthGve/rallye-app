<template>
  <AdminLayout>
    <template #default="{ user }">
      <div class="admin-user-view">
        <UserTable :currentUser="user" />
      </div>
    </template>
  </AdminLayout>
</template>

<script>
import UserTable from "../components/UserTable.vue";
import AdminLayout from "../layouts/AdminLayout.vue";

export default {
  name: "AdminUserView",
  components: {
    AdminLayout,
    UserTable,
  },
};
</script>

<style scoped>
.admin-user-view {
  text-align: center;
  margin-top: 70px;
}
</style>
