<template>
  <div class="product">
    <div class="product__functions">
      <button @click="rejectProduct(product._id)" v-if="user.privileges>0 && isAdminView" class="product__function--button">
        <Reject class="product__function product__function--reject" />
      </button>
      <button @click="acceptProduct(product._id)" v-if="user.privileges>0 && isAdminView" class="product__function--button">
        <Accept class="product__function product__function--accept" />
      </button>
      <button @click="deleteProduct(product._id)" v-if="user.privileges>0 && !isAdminView" class="product__function--button">
        <Delete class="product__function product__function--delete" />
      </button>
      <button v-if="!isAdminView" class="product__function--button">
        <router-link :to="{ name: 'Product', params: {id: product._id}}">
          <Edit class="product__function product__function--edit" />
        </router-link>
      </button>
    </div>
    <div class="product__image">
      <img
        v-if="product.image"
        :src="product.image"
        :alt="product.title"
        class="product__image--photo"
        />
    </div>
    <div class="product__head-inforamtion">
      <h1 class="product__title">{{ product.title }}</h1>
      <h2 class="product__price">{{ product.price }}&nbsp;zł</h2>
    </div>
    <h4 class="product__short-description">{{ product.description }}</h4>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import store from "../store";

import Edit from "./icons/Edit.vue";
import Delete from "./icons/Delete.vue";
import Reject from "./icons/Reject.vue";
import Accept from "./icons/Accept.vue";

const loading = computed(() => store.state.currentProduct.loading);
const user = computed(() => store.state.user.data);
defineProps(['product', 'isAdminView'])

function deleteProduct(id) {
  store.dispatch("deleteProduct", id).then(() => {
    store.commit("notify", {
      type: "success",
      message: `Produkt został pomyślnie usunięty`,
    });
  })
}


function acceptProduct(id) {
  store.dispatch("acceptProduct", id).then(() => {
    store.commit("notify", {
      type: "success",
      message: `Produkt został zaakceptowany`,
    });
  })
}

function rejectProduct(id) {
  store.dispatch("rejectProduct", id).then(() => {
    store.commit("notify", {
      type: "success",
      message: `Produkt został odrzucony`,
    });
  })
}


</script>

<style scoped>
.product__image--photo{
  object-fit:cover;
  width: 100%;
}

.product__function--button{
  border: none;
  background: transparent;
}
.product__functions{
  display: flex;
  justify-content: flex-end;
}
.product__function{
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.product__function--edit{
  right: 0;
}
.product__function--delete{
  right: 5px;
}
.product__function--reject{
  right: 5px;
}
.product__function--accept{
  right: 0;
}
.product{
  width: 100%;
  height: 400px;
  border: 1px solid var(--black);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  animation: fade-in-out 0.5s ease-in-out both
}

.product__image{
  margin: 0px auto;
  width: 90%;
  height: 200px;
  background-color: var(--yellow-5);
  display: flex;
}
.product__title{
  font-size: 20px;
  font-weight: 700;
  max-height: 64px;
  overflow: hidden;
}
.product__price{
  text-align: right;
  font-weight: 900;
  font-size: 26px;
}
.product__short-description{
  max-height: 72px;
  overflow: hidden;
}
.product__head-inforamtion{
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
</style>