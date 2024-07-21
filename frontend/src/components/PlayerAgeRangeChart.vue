<template>
  <div class="player-age-range-chart text-base p-4 border rounded-lg shadow-lg">
    <h3 class="text-l font-semibold mb-4">
      Répartition des joueurs par tranche d'âge
    </h3>
    <Chart type="bar" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import Chart from "primevue/chart";

export default {
  name: "PlayerAgeRangeChart",
  components: {
    Chart,
  },
  setup() {
    const chartData = ref({
      labels: [],
      datasets: [
        {
          label: "Nombre de joueurs",
          backgroundColor: [
            "#42A5F5",
            "#FF6384",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#66FF66",
          ],
          borderRadius: 10, // Arrondi au sommet des barres
          barPercentage: 0.5, // Réduire la largeur des barres
          data: [],
        },
      ],
    });

    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: true, // Cacher l'axe X
        },
        y: {
          display: false, // Cacher l'axe Y
        },
      },
      plugins: {
        legend: {
          display: false, // Cacher la légende
        },
      },
    });

    const fetchPlayerAgeRanges = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/users/players-by-age-range`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch player age ranges");
        }
        const data = await response.json();
        chartData.value.labels = data.map((range) => range.label);
        chartData.value.datasets[0].data = data.map((range) => range.count);
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(() => {
      fetchPlayerAgeRanges();
    });

    return { chartData, chartOptions };
  },
};
</script>

<style scoped></style>
