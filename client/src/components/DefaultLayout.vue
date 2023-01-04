<template>
  <div class="screen">
    <nav class="nav">
      <div class="nav__menu">
        <router-link :to="{name: 'HomeView'}">
          <h1 class="nav__logo">ZARZĄDZANIE<br>PRODUKTAMI</h1> 
        </router-link>
        <div class="nav__actions">
          <router-link
            class="nav__action--default-button"
            :to="{ name: 'LoginView' }"
            @click="logout()"
            >Wyloguj się</router-link
          >
        </div>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import store from "../store";

function logout() {
  store.commit("logout");
  store.commit("notify", {
    type: "success",
    message: "Zostałeś prawidłowo wylogowany",
  });
}
</script>

<style scoped>
.screen {
  min-height: 100%;
  width: 100%;
}
.nav__menu,
.main {
  max-width: 1280px;
  display: flex;
  margin-left: auto;
  margin-right: auto;
}
.nav__menu {
  justify-content: space-between;
  padding-right: 1rem;
  padding-left: 1rem;
  align-items: center;
  height: 70px;
}
.nav__logo {
  font-weight: 900;
  color: var(--gray);
  font-size: 23px;
  text-align: center;
  line-height: 22px;
}

.main {
  flex-direction: column;
  padding-right: 0rem;
  padding-left: 0rem;
}
.nav {
  background-color: var(--yellow-5);
  box-shadow: 0px 5px 50px var(--weak-gray);
  border-bottom: 2px solid var(--gray);
  animation: fade-in-out 0.5s ease-in-out both
}
.nav__actions {
  display: flex;
  place-items: center;
  gap: 10px;
}

.nav__action--default-button {
  padding: 6px 17px;
  border-radius: 5px;
  transition: 0.5s;
  font-weight: 600;
  background-color: var(--gray);
  border: 2px solid var(--gray);
  color: var(--white);
}
.nav__action--default-button:hover {
  color: var(--gray);
  background-color: var(--white);
  border: 2px solid var(--gray);
}

@media (min-width: 768px) {
  .nav__menu,
  .main {
    max-width: 1280px;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    padding-right: 2rem;
    padding-left: 2rem;
  }
}
</style>
