<template>
  <AdminLayout>
    <template #default="{ user }">
      <div class="create-user-page">
        <CreateUserForm />
      </div>
    </template>
  </AdminLayout>
</template>

<script>
import AdminLayout from "../layouts/AdminLayout.vue";
import CreateUserForm from "../components/CreateUserForm.vue"; // Assurez-vous que l'extension .vue est incluse

export default {
  name: "AdminUserView",
  components: {
    AdminLayout,
    CreateUserForm,
  },
};
</script>

<style scoped>
.create-user-page {
  text-align: center;
  margin-top: 70px;
}
</style>
