<template>
  <AdminLayout>
    <div class="admin-home-view">
      <h1 class="text-3xl font-bold mb-4">
        Bienvenue dans la partie d'administration de l'application
      </h1>
      <p class="text-xs mb-6">
        Cette page est uniquement accessible aux utilisateurs ayant un profil
        d'administration
      </p>
      <div class="container mx-auto p-4">
        <!-- Cartes au-dessus des colonnes -->
        <div class="flex flex-wrap -mx-2">
          <div class="w-full sm:w-1/2 lg:w-1/5 px-2 lg:mb-0">
            <div class="p-6">
              <StatisticCard title="Joueurs">
                <p class="text-xl font-semibold">{{ playerCount }}</p>
              </StatisticCard>
            </div>
          </div>
          <div
            class="w-full sm:w-1/2 lg:w-1/5 px-2"
            @click="showOrganizerModal = true"
          >
            <div class="p-6">
              <StatisticCard class="cursor-pointer" title="Organisateurs">
                <p class="text-xl font-semibold">{{ organizerCount }}</p>
              </StatisticCard>
            </div>
          </div>
          <div class="w-full sm:w-1/2 lg:w-1/5 px-2" @click="showAdminModal = true">
            <div class="p-6">
              <StatisticCard class="cursor-pointer" title="Administrateurs">
                <p class="text-xl font-semibold">{{ adminCount }}</p>
              </StatisticCard>
            </div>
          </div>
          <div class="w-full sm:w-1/2 lg:w-1/5 px-2">
            <div class="p-6">
              <PlayerInfoCard title="Joueur le plus jeune">
                <p class="text-base">
                  <i :class="getGenderIcon(youngestPlayer.genre)" class="ml-2"></i>
                  {{ youngestPlayer.nom }} {{ youngestPlayer.prenom }}
                  <div>({{ calculateAge(youngestPlayer.date_de_naissance) }} ans)</div>
                </p>
              </PlayerInfoCard>
            </div>
          </div>
          <div class="w-full sm:w-1/2 lg:w-1/5 px-2 lg:mb-0">
            <div class="p-6">
              <PlayerInfoCard title="Joueur le plus âgé">
                <p class="text-base">
                  <i :class="getGenderIcon(oldestPlayer.genre)" class="ml-2"></i>
                  {{ oldestPlayer.nom }} {{ oldestPlayer.prenom }}
                  <div>
                    ({{ calculateAge(oldestPlayer.date_de_naissance) }} ans)
                  </div>
                </p>
              </PlayerInfoCard>
            </div>
          </div>
        </div>
      </div>

      <div class="flex">
        <!-- Première colonne avec une seule div -->
        <div class="w-1/2 p-4">
          <div class="p-6">
            <LastFiveUsersTable />
          </div>
        </div>
        <!-- Seconde colonne avec deux div superposées -->
        <div class="w-1/2 p-4">
          <div class="p-6">
            <PlayerGenderChart
              :maleCount="malePlayerCount"
              :femaleCount="femalePlayerCount"
            />
          </div>
          <div class="p-6">
            <PlayerAgeRangeChart :ageRangeData="ageRangeData" class="grow" />
          </div>
        </div>
      </div>

      <UserListModal
        :visible="showOrganizerModal"
        @update:visible="showOrganizerModal = $event"
        title="Liste des Organisateurs"
        role="organisateur"
      />
      <UserListModal
        :visible="showAdminModal"
        @update:visible="showAdminModal = $event"
        title="Liste des Administrateurs"
        role="admin"
      />
    </div>
  </AdminLayout>
</template>

<script>
import LastFiveUsersTable from "../components/LastFiveUsersTable.vue";
import PlayerAgeRangeChart from "../components/PlayerAgeRangeChart.vue";
import PlayerGenderChart from "../components/PlayerGenderChart.vue";
import PlayerInfoCard from "../components/PlayerInfoCard.vue";
import StatisticCard from "../components/StatisticCard.vue";
import UserListModal from "../components/UserListModal.vue";
import AdminLayout from "../layouts/AdminLayout.vue";

export default {
  name: "AdminHomeView",
  components: {
    AdminLayout,
    StatisticCard,
    PlayerInfoCard,
    PlayerGenderChart,
    PlayerAgeRangeChart,
    LastFiveUsersTable,
    UserListModal,
  },
  data() {
    return {
      user: null,
      playerCount: null,
      adminCount: null,
      organizerCount: null,
      malePlayerCount: 0,
      femalePlayerCount: 0,
      youngestPlayer: {},
      oldestPlayer: {},
      ageRangeData: [],
      showOrganizerModal: false,
      showAdminModal: false,
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
          nom: decoded.nom,
          prenom: decoded.prenom,
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
      await this.fetchPlayerGenderCounts(token);
      await this.fetchYoungestPlayer(token);
      await this.fetchOldestPlayer(token);
      await this.fetchPlayerAgeRangeData(token);
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
    async fetchPlayerGenderCounts(token) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/player-gender-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch player gender counts");
        }
        const data = await response.json();
        this.malePlayerCount = data.maleCount;
        this.femalePlayerCount = data.femaleCount;
      } catch (error) {
        this.error = error.message;
      }
    },
    async fetchYoungestPlayer(token) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/youngest-player`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch youngest player");
        }
        const data = await response.json();
        this.youngestPlayer = data;
      } catch (error) {
        this.error = error.message;
      }
    },
    async fetchOldestPlayer(token) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/oldest-player`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch oldest player");
        }
        const data = await response.json();
        this.oldestPlayer = data;
      } catch (error) {
        this.error = error.message;
      }
    },
    async fetchPlayerAgeRangeData(token) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/players-by-age-range`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch player age range data");
        }
        const data = await response.json();
        this.ageRangeData = data;
      } catch (error) {
        this.error = error.message;
      }
    },
    calculateAge(birthdate) {
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

      return age;
    },
    getGenderIcon(genre) {
      return genre === "M" ? "pi pi-mars" : "pi pi-venus";
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
