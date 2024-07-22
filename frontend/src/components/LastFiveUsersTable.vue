<template>
  <div class="border rounded-lg shadow-lg last-five-users-table">
    <DataTable :value="users" responsiveLayout="scroll" class="p-2">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-base font-bold"
            >5 derniers utilisateurs inscrits</span
          >
        </div>
      </template>
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
      <Column field="prenom" header="Prénom"></Column>
      <Column field="date_de_naissance" header="Date de Naissance">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.date_de_naissance) }}
        </template>
      </Column>
      <Column header="Genre">
        <template #body="slotProps">
          <i :class="getGenderIcon(slotProps.data.genre)"></i>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Avatar from "primevue/avatar";

export default {
  name: "LastFiveUsersTable",
  components: {
    DataTable,
    Column,
    Avatar,
  },
  data() {
    return {
      users: [],
    };
  },
  methods: {
    async fetchLastFiveUsers() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/last-five-users`,
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
        console.error(error);
      }
    },
    getInitials(prenom, nom) {
      if (!prenom || !nom) return "";
      return `${prenom[0]}${nom[0]}`;
    },
    avatarStyle(genre) {
      return {
        backgroundColor: genre === "M" ? "#0000FF" : "#FF69B4",
        color: "#FFFFFF",
      };
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    getGenderIcon(genre) {
      if (!genre) return "";
      return genre === "M" ? "pi pi-mars" : "pi pi-venus";
    },
  },
  mounted() {
    this.fetchLastFiveUsers();
  },
};
</script>

<style scoped></style>
