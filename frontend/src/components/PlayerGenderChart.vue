<template>
  <div class="player-gender-chart text-base p-4 border rounded-lg shadow-lg">
    <h3 class="text-l font-semibold mb-4">
      Répartion des joueurs <i class="pi pi-venus"></i
      ><i class="pi pi-mars"></i>
    </h3>
    <Chart type="bar" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { ref, watch } from "vue";
import Chart from "primevue/chart";

export default {
  name: "PlayerGenderChart",
  components: {
    Chart,
  },
  props: {
    maleCount: {
      type: Number,
      required: true,
    },
    femaleCount: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const chartData = ref({
      labels: ["Masculin", "Féminin"],
      datasets: [
        {
          label: "Nombre de joueurs",
          backgroundColor: ["#42A5F5", "#FF6384"],
          borderRadius: 10, // Arrondi au sommet des barres
          barPercentage: 0.5, // Réduire la largeur des barres
          data: [props.maleCount, props.femaleCount],
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

    watch(
      () => [props.maleCount, props.femaleCount],
      ([newMaleCount, newFemaleCount]) => {
        chartData.value.datasets[0].data = [newMaleCount, newFemaleCount];
      }
    );

    return { chartData, chartOptions };
  },
};
</script>

<style scoped></style>
