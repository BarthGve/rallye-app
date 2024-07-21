<template>
  <div class="last-five-users-table border p-4 shadow-lg rounded-lg">
    <DataTable :value="users" responsiveLayout="scroll" class="text-base">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-l font-bold"
            >5 derniers utilisateurs inscrits
          </span>
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

      <Column header="Âge">
        <template #body="slotProps">
          {{ calculateAge(slotProps.data.date_de_naissance) }}
        </template>
      </Column>
      <Column header="Enregistré le">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.createdAt) }}
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
        console.log("Fetched users data:", data); // Vérifiez les données ici
        this.users = data;
      } catch (error) {
        console.error(error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    calculateAge(birthdate) {
      const today = new Date();
      const birthDate = new Date(birthdate);
      let ageYears = today.getFullYear() - birthDate.getFullYear();
      let ageMonths = today.getMonth() - birthDate.getMonth();

      if (ageMonths < 0) {
        ageYears--;
        ageMonths += 12;
      }

      return `${ageYears} ans`;
    },
    getInitials(prenom, nom) {
      return `${prenom[0]}${nom[0]}`;
    },
  },
  mounted() {
    this.fetchLastFiveUsers();
  },
};
</script>

<style scoped></style>
