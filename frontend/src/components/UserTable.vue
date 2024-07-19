<template>
  <div class="user-table">
    <div class="card p-4 shadow-lg rounded-lg bg-white">
      <DataTable :value="users" class="min-w-full">
        <Column field="id" header="ID"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="role" header="Role"></Column>
        <Column header="Created At">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.createdAt) }}
          </template>
        </Column>
        <Column header="Updated At">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.updatedAt) }}
          </template>
        </Column>
        <Column header="État">
          <template #body="slotProps">
            <span>
              <i
                class="pi pi-trash text-red-600 hover:text-red-800 cursor-pointer"
                @click="confirmDeleteUser(slotProps.data.id)"
              ></i>
            </span>
          </template>
        </Column>
      </DataTable>
    </div>

    <div v-if="error" class="text-red-600 mt-4">{{ error }}</div>

    <div
      v-if="showConfirmModal"
      class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="modal-content bg-white p-6 rounded-lg text-center">
        <p class="mb-4">
          Êtes-vous bien sûr de vouloir définitivement supprimer l'utilisateur
          {{ userIdToDelete }} ?
        </p>
        <div class="flex justify-around">
          <button
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            @click="deleteUser(userIdToDelete)"
          >
            Oui
          </button>
          <button
            class="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            @click="closeConfirmModal"
          >
            Non
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import "primeicons/primeicons.css";

export default {
  name: "UserTable",
  components: {
    DataTable,
    Column,
  },
  data() {
    return {
      users: [],
      error: null,
      showConfirmModal: false,
      userIdToDelete: null,
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/all-users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        this.users = data;
      } catch (error) {
        this.error = error.message;
      }
    },
    confirmDeleteUser(userId) {
      this.userIdToDelete = userId;
      this.showConfirmModal = true;
    },
    async deleteUser(userId) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        this.users = this.users.filter((user) => user.id !== userId);
        this.showConfirmModal = false;
        this.$emit("user-deleted"); // Émet un événement personnalisé après suppression
      } catch (error) {
        this.error = error.message;
      }
    },
    closeConfirmModal() {
      this.showConfirmModal = false;
      this.userIdToDelete = null;
    },
    viewUser(userId) {
      // Logic to view user details
      console.log("Viewing user", userId);
    },
    editUser(userId) {
      // Logic to edit user details
      console.log("Editing user", userId);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
};
</script>

<style scoped>
.user-table {
  text-align: center;
  margin-top: 20px;
}
.card {
  margin-top: 20px;
}
i {
  cursor: pointer;
  margin: 0 5px;
}
.error {
  color: red;
  margin-top: 10px;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
</style>
