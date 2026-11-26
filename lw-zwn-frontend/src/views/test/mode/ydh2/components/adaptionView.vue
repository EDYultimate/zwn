<template>
  <div>
    <teleport v-if="dialogTe" to="#commonAdaptationContainer">
      <slot></slot>
    </teleport>
  </div>
</template>

<script setup>
const dialogTe = ref(false)

onMounted(() => {
  const targetElement = document.getElementById('commonAdaptationContainer')
  if (targetElement) {
    dialogTe.value = true
  } else {
  }
})
</script>

<style lang="scss" scoped></style>
