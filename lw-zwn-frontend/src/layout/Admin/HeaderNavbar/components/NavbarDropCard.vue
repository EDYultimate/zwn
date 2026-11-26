<script setup lang="ts">
import { ref } from 'vue'

import type { RouteRecordRaw } from 'vue-router'

const props = defineProps<{ dropMenu: RouteRecordRaw }>()
const childrenRef = ref(props.dropMenu.children)
</script>

<template>
  <div class="navbar-drop-card">
    <div class="navbar-drop-card-background">
      <div v-for="(item, index) in childrenRef" :key="index" class="navbar-drop-card-item">
        <router-link
          :to="{ path: `${dropMenu.path}/${item.path}` }"
          class="navbar-drop-card-item-content-item-link"
        >
          {{ item.meta?.title }}
        </router-link>
      </div>
    </div>
    <div />
  </div>
</template>

<style lang="scss" scoped>
.navbar-drop-card {
  max-height: calc(50vh - 41px);
  position: absolute;
  z-index: 999;
  top: 41px;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  padding-top: 15px;
}
.navbar-drop-card-background {
  background: rgba(13, 34, 99, 0.9);
  backdrop-filter: blur(1px);
  color: #fff;
  display: flex;
  border-radius: 3px;
  :last-child {
    border-right: 0;
  }
  padding: 5px 0;
}
.navbar-drop-card-item {
  padding: 17px 25px;
  border-right: 1px solid #3b4e87;
}
.navbar-drop-card-item-content-item-link {
  color: #f7f8f0;
  font-size: 1rem;
  text-align: center;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: color 0.3s;
  font-weight: normal;
  padding: 0 15px;
  line-height: 2;
  white-space: nowrap;
}
.navbar-drop-card-item-content-item-link.router-link-active {
  color: #fee125;
  transition: color 0.3s;
  position: relative;
  &:before {
    content: '[';
    position: absolute;
    left: 0;
  }

  &:after {
    content: ']';
    position: absolute;
    right: 0;
  }
}
</style>
