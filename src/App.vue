<template>
  <div class="quiz-container min-h-screen flex flex-col">
    <router-view v-slot="{ Component, route }">
      <transition 
        :name="route.meta.transition || 'slide-right'" 
        mode="out-in"
      >
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
// App.vue는 루트 컴포넌트로 모든 페이지의 레이아웃을 담당합니다
</script>