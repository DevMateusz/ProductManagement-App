<template>
  <div class="screen">
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.screen {
  height: 100vh;
  width: 100vw;
  background-color: var(--white);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.auth-link__logo {
  height: 100px;
}
.main {
  max-width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  animation: fade-in-out 0.5s ease-in-out both
}
@media (min-width: 768px) {
  .main {
    margin-top: 100px;
    max-width: 450px;
  }
}
</style>
