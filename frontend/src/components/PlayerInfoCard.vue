<template>
  <div
    class="player-info-card p-2 border text-base rounded-lg shadow-lg w-full"
  >
    <h3 class="text-l font-semibold mb-2">{{ title }}</h3>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlayerInfoCard",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped></style>
