<template>
  <div class="user-table">
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <Dialog
      v-model:visible="showEditModal"
      modal
      header="Modifier l'utilisateur"
      :style="{ width: '25rem' }"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8">
        Mettre à jour les informations de l'utilisateur.
      </span>
      <div class="flex items-center gap-4 mb-4">
        <label for="nom" class="font-semibold w-24">Nom</label>
        <InputText
          id="nom"
          v-model="editUser.nom"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="prenom" class="font-semibold w-24">Prénom</label>
        <InputText
          id="prenom"
          v-model="editUser.prenom"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="email" class="font-semibold w-24">Email</label>
        <InputText
          id="email"
          v-model="editUser.email"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="genre" class="font-semibold w-24">Genre</label>
        <div class="flex gap-4">
          <RadioButton
            inputId="genre-m"
            v-model="editUser.genre"
            :value="'M'"
            class="flex-auto"
            name="genre"
          />
          <label for="genre-m" class="font-semibold"
            ><i class="pi pi-mars"></i
          ></label>
          <RadioButton
            inputId="genre-f"
            v-model="editUser.genre"
            :value="'F'"
            class="flex-auto"
            name="genre"
          />
          <label for="genre-f" class="font-semibold"
            ><i class="pi pi-venus"></i
          ></label>
        </div>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="date_de_naissance" class="font-semibold w-24">
          Date de naissance
        </label>
        <InputText
          id="date_de_naissance"
          v-model="editUser.date_de_naissance"
          class="flex-auto"
          autocomplete="off"
          type="date"
        />
      </div>
      <div class="flex items-center gap-4 mb-8">
        <label for="role" class="font-semibold w-24">Rôle</label>
        <Select
          id="role"
          v-model="editUser.role"
          :options="roles"
          class="flex-auto"
          :disabled="editUser.id === currentUser.id"
          optionLabel="label"
          optionValue="value"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Annuler"
          severity="secondary"
          @click="closeEditModal"
        />
        <Button type="button" label="Enregistrer" @click="updateUser" />
      </div>
    </Dialog>
    <div class="card p-4 shadow-lg rounded-lg">
      <DataTable
        :value="filteredUsers"
        class="min-w-full"
        :paginator="true"
        :rows="10"
        :first="first"
        @page="onPageChange"
        sortMode="multiple"
      >
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xl font-bold"
              >Utilisateurs ({{ totalUsers }})</span
            >
            <InputText
              v-model="search"
              placeholder="🔎 Rechercher un utilisateur"
            />
          </div>
        </template>
        <Column>
          <template #body="slotProps">
            <Avatar
              :label="getInitials(slotProps.data.prenom, slotProps.data.nom)"
              :style="{
                backgroundColor:
                  slotProps.data.genre === 'M' ? '#0000FF' : '#FF69B4',
                color: '#FFFFFF',
              }"
              shape="circle"
            />
          </template>
        </Column>
        <Column field="nom" header="Nom" sortable></Column>
        <Column field="prenom" header="Prénom"></Column>
        <Column field="email" header="Email"></Column>
        <Column header="Âge">
          <template #body="slotProps">
            {{ calculateAge(slotProps.data.date_de_naissance) }}
          </template>
        </Column>
        <Column header="Rôle">
          <template #body="slotProps">
            <Tag
              :value="slotProps.data.role"
              :severity="getRoleSeverity(slotProps.data.role)"
            />
          </template>
        </Column>
        <Column header="Créé le">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.createdAt) }}
          </template>
        </Column>
        <Column header="Mis à jour le">
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
                :class="{ 'opacity-50': slotProps.data.id === currentUser.id }"
                :style="{
                  pointerEvents:
                    slotProps.data.id === currentUser.id ? 'none' : 'auto',
                }"
              ></i>
              <i
                class="pi pi-pencil text-blue-600 hover:text-blue-800 cursor-pointer"
                @click="openEditModal(slotProps.data)"
              ></i>
            </span>
          </template>
        </Column>
      </DataTable>
    </div>
    <div v-if="error" class="text-red-600 mt-4">{{ error }}</div>
  </div>
</template>

<script>
import "primeicons/primeicons.css";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Column from "primevue/column";
import ConfirmDialog from "primevue/confirmdialog";
import DataTable from "primevue/datatable";
import Dialog from "primevue/dialog";
import Select from "primevue/select";
import InputText from "primevue/inputtext";
import RadioButton from "primevue/radiobutton";
import Toast from "primevue/toast";
import Tag from "primevue/tag";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { onMounted, ref, computed } from "vue";

export default {
  name: "UserTable",
  components: {
    DataTable,
    Column,
    ConfirmDialog,
    Toast,
    Dialog,
    InputText,
    Button,
    Select,
    RadioButton,
    Avatar,
    Tag,
  },
  props: {
    currentUser: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const users = ref([]);
    const search = ref("");
    const error = ref(null);
    const showEditModal = ref(false);
    const editUser = ref({
      id: null,
      nom: "",
      prenom: "",
      email: "",
      genre: "",
      date_de_naissance: "",
      role: "",
    });
    const roles = ref([
      { label: "Joueur", value: "joueur" },
      { label: "Admin", value: "admin" },
      { label: "Organisateur", value: "organisateur" },
    ]);
    const first = ref(0);

    const confirm = useConfirm();
    const toast = useToast();

    const totalUsers = computed(() => users.value.length);
    const filteredUsers = computed(() => {
      if (!search.value) return users.value;
      return users.value.filter(
        (user) =>
          user.nom.toLowerCase().includes(search.value.toLowerCase()) ||
          user.prenom.toLowerCase().includes(search.value.toLowerCase()) ||
          user.email.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    const fetchUsers = async () => {
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
        users.value = data;
      } catch (err) {
        error.value = err.message;
      }
    };

    const onPageChange = (event) => {
      first.value = event.first;
    };

    const refreshUsers = async () => {
      await fetchUsers();
    };

    const confirmDeleteUser = (userId) => {
      confirm.require({
        message:
          "Êtes-vous bien sûr de vouloir définitivement supprimer cet utilisateur?",
        header: "Confirmer la suppression",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Supprimer",
        rejectLabel: "Annuler",
        rejectProps: {
          label: "Annuler",
          severity: "secondary",
          outlined: true,
        },
        acceptProps: {
          label: "Supprimer",
          severity: "danger",
        },
        accept: () => {
          deleteUser(userId);
        },
        reject: () => {
          toast.add({
            severity: "error",
            summary: "Annulé",
            detail: "Vous avez annulé la suppression",
            life: 3000,
          });
        },
      });
    };

    const deleteUser = async (userId) => {
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
        users.value = users.value.filter((user) => user.id !== userId);
        toast.add({
          severity: "success",
          summary: "Succès",
          detail: "Utilisateur supprimé",
          life: 3000,
        });
      } catch (err) {
        error.value = err.message;
        toast.add({
          severity: "error",
          summary: "Erreur",
          detail: "Échec de la suppression de l'utilisateur",
          life: 3000,
        });
      }
    };

    const openEditModal = (user) => {
      editUser.value = { ...user };
      showEditModal.value = true;
    };

    const closeEditModal = () => {
      showEditModal.value = false;
    };

    const updateUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/${editUser.value.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editUser.value),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        toast.add({
          severity: "success",
          summary: "Succès",
          detail: "Utilisateur mis à jour",
          life: 3000,
        });
        closeEditModal();
        refreshUsers();
      } catch (err) {
        error.value = err.message;
        toast.add({
          severity: "error",
          summary: "Erreur",
          detail: "Échec de la mise à jour de l'utilisateur",
          life: 3000,
        });
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    const calculateAge = (birthdate) => {
      const today = new Date();
      const birthDate = new Date(birthdate);
      let ageYears = today.getFullYear() - birthDate.getFullYear();
      let ageMonths = today.getMonth() - birthDate.getMonth();

      if (ageMonths < 0) {
        ageYears--;
        ageMonths += 12;
      }

      return `${ageYears} ans`;
    };

    const getInitials = (prenom, nom) => {
      if (!prenom || !nom) return "";
      return `${prenom[0]}${nom[0]}`;
    };

    const getRoleSeverity = (role) => {
      switch (role) {
        case "joueur":
          return "success";
        case "organisateur":
          return "info";
        case "admin":
          return "warn";
        default:
          return null;
      }
    };

    onMounted(() => {
      fetchUsers();
    });

    return {
      users,
      search,
      error,
      confirmDeleteUser,
      openEditModal,
      closeEditModal,
      updateUser,
      formatDate,
      calculateAge,
      showEditModal,
      editUser,
      roles,
      currentUser: props.currentUser,
      first,
      onPageChange,
      getInitials,
      totalUsers,
      getRoleSeverity,
      filteredUsers,
    };
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
