<template>
  <div class="statistic-card text-base p-2 border rounded-lg shadow-lg w-full">
    <h3 class="text-primary text-l font-semibold mb-2">{{ title }}</h3>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatisticCard",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
