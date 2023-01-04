<template>
  <div class="main" v-if="!loading">
    <form @submit.prevent="user.privileges ? saveProduct(model) : sendToAccept(model)" class="form">
      <div class="form__element form__image">
        <label class="form__element--label"> Zdjęcie </label>
        <div class="form__image--container">
          <img
            v-if="model.image"
            :src="model.image"
            :alt="model.title"
            class="form__image--photo"
          />
          <Photo v-else class="form__image--photo"/>
          <button type="button" class="form__image--button">
            <input type="file" @change="onImageChoose" class="form__image--button__input" :required="model.image ? false : true" />
            Change
          </button>
        </div>
      </div>
      <div class="form__element">
        <label for="title" class="form__element--label">Tytuł</label>
        <input
          type="text"
          name="title"
          id="title"
          v-model="model.title"
          autocomplete="survey_title"
          class="form__element--input"
          required
        />
      </div>
      <div class="form__element">
        <label for="title" class="form__element--label">Cena</label>
        <input
          type="number" 
          min="0.00"
          step="0.01"
          name="price"
          id="price"
          v-model="model.price"
          autocomplete="survey_title"
          class="form__element--input"
          required
        />
      </div>
      <div class="form__element">
        <label for="about" class="form__element--label"> Opis </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            v-model="model.description"
            autocomplete="survey_description"
            class="form__element--input"
            required
          />
      </div>
      <div class="form__element">
        <label for="about" class="form__element--label"> Kategoria </label>
        <select v-model="model.category" name="category" id="category-select" class="form__element--input" required>
          <option value="">Proszę wybrać kategorię</option>
          <option value="board games">gry planoszowe</option>
          <option value="electric cars">samochody elektryczne</option>
          <option value="tvs">telewizory</option>
          <option value="toys">zabawki</option>
      </select>
      </div>
        <button v-if="user.privileges == 0"  type="submit" class="form__submit-button form__button" >
          Wyślij Produkt Do Zatwierdzenia
        </button>
        <button v-if="user.privileges == 1" type="submit" class="form__submit-button form__button" >
          {{ route.params.id ? 'Aktualizuj Produkt' : 'Stwórz Produkt' }}
        </button>
    </form>
    <button @click="deleteProduct(route.params.id)" v-if="route.params.id && user.privileges == 1" class="form__delete-button form__button" formnovalidate >
      Usuń Produkt
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import store from "../store";

import Photo from "../components/icons/Photo.vue"

const user = computed(() => store.state.user.data)
const loading = computed(() => store.state.currentProduct.loading)
const router = useRouter();
const route = useRoute();
let model = ref({
  title: "",
  price: "",
  description: null,
  image: null,
  category: ""
});

if (route.params.id) {
  store.dispatch("getProduct", route.params.id).then((product) => {
    model.value = {
      ...JSON.parse(JSON.stringify(product.data)),
    };
    model.value._id = route.params.id
    model.value.image = `${import.meta.env.VITE_API_BASE_URL}/api/image/${model.value.image}`
  })
}

function onImageChoose(event) {
  const file = event.target.files[0];

  const reader = new FileReader();
  reader.onload = () => {
    model.value.image = reader.result;
  };
  reader.readAsDataURL(file);
}



function deleteProduct(id) {
  store.dispatch("deleteProduct", id).then(() => {
    router.push({name: 'HomeView'});
    store.commit("notify", {
      type: "success",
      message: `Produkt został pomyślnie usunięty`,
    });
  })
}

function saveProduct(product) {
  store.dispatch("saveProduct", product).then(data => {
    model.value._id = data.data._id
    router.push({
        name: "Product",
        params: { id: data.data._id },
      });
    let action = "stworzony"
    if (product._id) {
      action = "zaktualizowany"
    }
    store.commit("notify", {
      type: "success",
      message: `Produkt został pomyślnie ${action}`,
    });
  })
}
function sendToAccept(product) {
  const {category, description, image, price, title} = product
  
  store.dispatch("verifyProduct", {category, description, image, price, title, productID: product._id}).then(data => {
    router.push({
        name: "HomeView",
      });
    store.commit("notify", {
      type: "success",
      message: `Produkt został pomyślnie przesłany do weryfikacji`,
    });
  })
}

</script>

<style scoped>
.form__button{
  height: 41px;
  justify-content: center;
  display: flex;
  align-items: center;
  border: none;
  color: var(--white);
  padding: 10px 25px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.1s;
  align-self: flex-end;
}
.form__submit-button{
  background-color: var(--yellow-1);
  width: 100%;
}
.form__submit-button:hover{
  background-color: var(--yellow-2);
}
.form__delete-button{
  background-color: var(--red-1);
  position: absolute;
  top: 20px;
  right: 20px;
}
.form__delete-button:hover{
  background-color: var(--red-2);
}

.main{
  display: flex;
}
.form{
  position: relative;
  background-color: var(--white);
  padding: 20px;
  margin-top: 40px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form__image--photo{
  height: 140px;
  object-fit:cover;
}

.form__image--button__input{
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  cursor: pointer;
}
.form__image--container{
  display: flex;
  align-items: center;
  gap: 10px;
}
.form__element{
  display: flex;
  flex-direction: column;
}
.form__element--label{
  font-weight: 700;
}
.form__element--input, .form__image--button{
  padding: 8px;
  border: 1px solid var(--weak-gray);
  border-radius: 5px;

}
.form__element--input {
  width: 100%;
}

.form__image--button{
  width: 100px;
  font-weight: 700;
  cursor: pointer;
}

@media (min-width: 768px) {
  .form__button{
    width:auto;
  }
  .form__delete-button{
    right: 60px;
    top: 60px;
  }
}
</style>
