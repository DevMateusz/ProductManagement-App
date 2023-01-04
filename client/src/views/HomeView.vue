<template>
  <div class="main">
    <div class="function-container">
      <div class="search-container" >
        <input
          v-model="sort.search"
          type="search"
          name="search"
          class="function-container__search"
          autocomplete="off"
        />
        <Search class="function-container__search-icon" />
      </div>
      <router-link
        :to="{ name: 'ProductCreate' }"
        v-if="privileges == 1"
        class="function-container__button--add"
      >
        <Plus class="function-container__button--add__icon" />
        Dodaj nowy produkt</router-link
      >
    </div>
    <div class="management-container">
      <div class="categories-container">
        <div class="product-categories">
          <h2>Kategorie</h2>
          <ul>
            <li
              v-show="privileges >= category.accessLevel"
              :style="category.accessLevel == 1 ? 'color: var(--red-1)' : ''"
              @click="setCategory(category)"
              class="category"
              :class="category.query == sort.category.query ? 'category--selected' : ''"
              v-for="category in categories"
            >
              {{ category.name }}
            </li>
          </ul>
        </div>
      </div>
      <div  class="products-container" :key="refreshComponent">
        <Product 
          v-if="(!loading)"
          v-for="(product, index) in products" 
          :key="product._id" 
          :product="product"
          :style="`animation-delay: ${0.4+index * 0.05}s;`"
          :isAdminView="isAdminView()"
          />
        <div v-if="products.length <= 0 && !loading" class="products-container__no-found" >Nie znaleziono produktów</div>
        <div v-if="loading" class="products-container__loading">
          <Loading class="loading__icon" />
          Loading
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import store from "../store";

import Loading from "../components/icons/Loading.vue";
import Plus from "../components/icons/Plus.vue";
import Search from "../components/icons/Search.vue";
import Product from "../components/Product.vue";

const route = useRoute();

const sort = reactive({
  search: "",
  category: {},
});

const categories = [
  { accessLevel: 0, name: "wszystko", query: "all" },
  { accessLevel: 0, name: "gry planoszowe", query: "board games" },
  { accessLevel: 0, name: "samochody elektryczne", query: "electric cars" },
  { accessLevel: 0, name: "telewizory", query: "tvs" },
  { accessLevel: 0, name: "zabawki", query: "toys" },
  { accessLevel: 1, name: "produkty do potwierdzenia", query: "products to confirm" },
];

const privileges = computed(() => store.state.user.data.privileges);
const loading = computed(() => store.state.products.loading);
const rawProducts = computed(() => store.state.products.data);
const refreshComponent = ref(0)
let products = rawProducts;
setCategory(categories[0])

watch(
  () => sort.search,
  function (newVal, oldVal) {
    filterResults();
  }
);

watch(
  () => rawProducts.value,
  function (newVal, oldVal) {
    refreshComponent.value += 1
    filterResults();
  }
);


function setCategory(category) {
  sort.category = category;
  store.dispatch("getProducts", category.query).then(() => {
    filterResults();
  })
  
}
function filterResults() {
  const reg = new RegExp(sort.search, "i");
  products = rawProducts.value.filter((product) => {
    return reg.test(product.title);
  });
}


function isAdminView(){
  if (sort.category.accessLevel>0) {
    return true;
  }
  return false;
}
</script>

<style scoped>
.function-container__button--add__icon {
  width: 30px;
  height: 30px;
}
.function-container__button--add {
  height: 41px;
  justify-content: center;
  display: flex;
  align-items: center;
  border: none;
  color: var(--white);
  background-color: var(--gray);
  width: 100%;
  padding: 10px 25px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.3s;
  align-self: flex-end;
  animation: fade-in-out 0.5s ease-in-out both 0.2s
}
.function-container__button--add:hover {
  background-color: var(--yellow-1);
  color: var(--gray);
}
.products-container {
  width: 100%;
  justify-items: center;
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  position: relative;
}
.main {
  display: flex;
  gap: 20px;
}
.category {
  text-decoration: none;
  padding: 3px;
  margin-left: -10px;
  list-style-type: circle;
  cursor: pointer;
  color: var(--gray);
}
.category--selected {
  list-style-type: disc;
  font-weight: 700;
}
.categories-container {
  width: 100%;
}
.product-categories {
  border: 1px solid;
  border-radius: 10px;
  padding: 10px;
  animation: fade-in-out 0.5s ease-in-out both 0.3s
}
.management-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin: 0px 5px;
}
.products-container__loading, .products-container__no-found {
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  position: absolute;
  top: 0;
}

.products-container__no-found{
  animation: fade-in-out 0.4s ease-in-out both;
}
.loading__icon {
  width: 36px;
  height: 36px;
}

.function-container {
  min-height: 35px;
  display: flex;
  margin: 5px;
  gap: 10px;
  flex-direction: column;
}
.search-container {
  display: flex;
  justify-content: center;
  flex: 1;
  animation: fade-in-out 0.5s ease-in-out both 0.1s
}

.function-container__search {
  flex: 1;
  height: 35px;
  padding: 2px 10px;
  font-size: 19px;
  border: 1px solid;
  border-radius: 5px;
}
.function-container__search-icon {
  width: 35px;
  height: 35px;
  margin: 0px 5px;
}

@media (min-width: 768px) {
  .function-container__button--add {
    height: 41px;
    justify-content: center;
    display: flex;
    align-items: center;
    border: none;
    color: var(--white);
    background-color: var(--gray);
    width: auto;
    padding: 10px 25px;
    border-radius: 12px;
    font-weight: 800;
    cursor: pointer;
    transition: 0.3s;
    align-self: flex-end;
  }
  .management-container {
    flex-direction: row;
    margin: 0px;
  }
  .products-container {
    display: grid;
    grid-template-columns: 1fr;
  }
  .categories-container {
    width: 40%;
  }
  .search-container {
    justify-content: start;
  }
  .function-container {
    justify-content: flex-end;
    flex-direction: row;
    position: relative;
  }

  .function-container__search {
    flex: none;
    width: 350px;
  }
}
@media (min-width: 1024px) {
  .products-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .categories-container {
    width: 35%;
  }
  .search-container {
    position: absolute;
    justify-content: center;
    left: 35%;
  }
  .search-container .search {
    width: 350px;
  }
}
</style>
