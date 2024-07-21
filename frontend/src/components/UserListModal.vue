<template>
  <Dialog
    v-model:visible="visible"
    modal
    :style="{ width: '50vw' }"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
  >
    <template #header>
      <div class="modal-header">
        <span>{{ title }}</span>
      </div>
    </template>
    <DataTable :value="users" responsiveLayout="scroll">
      <Column>
        <template #body="slotProps">
          <Avatar
            :label="getInitials(slotProps.data.prenom, slotProps.data.nom)"
            :style="avatarStyle(slotProps.data.genre)"
            shape="circle"
          />
        </template>
      </Column>
      <Column field="nom" header="Nom" sortable></Column>
      <Column field="prenom" header="Prénom" sortable></Column>
      <Column field="date_de_naissance" header="Âge">
        <template #body="slotProps">
          {{ calculateAge(slotProps.data.date_de_naissance) }}
        </template>
      </Column>
      <Column field="email" header="Email"></Column>
    </DataTable>
  </Dialog>
</template>
<script>
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Avatar from "primevue/avatar";
import Button from "primevue/button";

export default {
  name: "UserListModal",
  components: {
    Dialog,
    DataTable,
    Column,
    Avatar,
    Button,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:visible"],
  setup(props, { emit }) {
    const users = ref([]);
    const error = ref(null);
    const visible = ref(props.visible);

    const fetchUsersByRole = async (role) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/by-role/${role}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch ${role}`);
        }
        const data = await response.json();
        users.value = data;
      } catch (err) {
        error.value = err.message;
      }
    };

    watch(
      () => props.visible,
      (newValue) => {
        visible.value = newValue;
        if (newValue) {
          fetchUsersByRole(props.role);
        }
      }
    );

    const closeModal = () => {
      emit("update:visible", false);
    };

    const calculateAge = (birthdate) => {
      const today = new Date();
      const birthDate = new Date(birthdate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return `${age} ans`;
    };

    const getInitials = (prenom, nom) => {
      if (!prenom || !nom) return "";
      return `${prenom[0]}${nom[0]}`;
    };

    const avatarStyle = (genre) => {
      return {
        backgroundColor: genre === "M" ? "#0000FF" : "#FF69B4",
        color: "#FFFFFF",
      };
    };

    return {
      users,
      error,
      calculateAge,
      getInitials,
      avatarStyle,
      closeModal,
      visible,
    };
  },
};
</script>
<style scoped>
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>
