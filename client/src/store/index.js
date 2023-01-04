import { createStore } from 'vuex';
import axiosClient from '../axios';
import router  from '../router';

const store = createStore({
  state: {
    user: {
      data: JSON.parse(sessionStorage.getItem('USER')),
      token: sessionStorage.getItem('TOKEN'),
    },
    products: {
      data: [],
      loading: false,
    },
    currentProduct: {
      data: {},
      loading: false,
    },
    notifications: {
      data: [],
      index: 0
    },

  },
  getters: {},
  actions: {
    getProducts({ commit}, category) {
      commit("setProductsLoading", true);
      return axiosClient.get(`/api/products/${category}`).then((res) => {
        commit("setProducts", res.data);
        commit("setProductsLoading", false);
        return res;
      }).catch((err) => {
        commit("setProductsLoading", false);
        throw err;
      })
      
    },
    saveProduct({ commit }, product) {
      if(product._id){
        return axiosClient.put(`/api/product/${product._id}`, product).then((res) => {
              return res;
          }).catch((err) => {
            throw err;
          })
      } else {
        return axiosClient.post(`/api/product`, product).then((res) => {
            return res;
          }).catch((err) => {
            throw err;
          })
      }

    },
    deleteProduct({ commit }, id) {
      return axiosClient.delete(`/api/product/${id}`).then((res) => {
          commit("removeProduct", res.data);
          return res
        }).catch((err) => {
          throw err;
        })
    },
    getProduct({ commit }, id){
      commit("setProductLoading", true);
      return axiosClient.get(`/api/product/${id}`).then((res) => {
        commit("setProduct", res.data);
        commit("setProductLoading", false);
        return res;
      }).catch((err) => {
        commit("setProductLoading", false);
        throw err;
      })
    },
    acceptProduct({ commit }, id){
      return axiosClient.post(`/api/product/${id}/accept`).then((res) => {
        commit("removeProduct", res.data);
        return res;
      }).catch((err) => {
        throw err;
      })
    },
    rejectProduct({ commit }, id){
      return axiosClient.post(`/api/product/${id}/reject`).then((res) => {
        commit("removeProduct", res.data);
        return res;
      }).catch((err) => {
        throw err;
      })
    },
    verifyProduct({ commit }, product){
      if (product.image.includes("/api/image/")) {
        product.image = product.image.split("/image/")[1]
      }
      return axiosClient.post(`/api/product/verify`, product).then((res) => {
        return res;
      }).catch((err) => {
        throw err;
      })
    },
    
    login({commit}, user) {
      return axiosClient.post('/login', user).then(({data}) => {
        commit('setUser', data);
        return data;
      }).catch((err) => {
        throw err;
      })
    },
    register({commit}, user) {
      return axiosClient.post('/register', user).then(({data}) => {
        commit('setUser', data);
        return data;
      }).catch((err) => {
        throw err;
      })
    },
  },
  mutations: {
    setProduct: (state, product) => {
      state.currentProduct.data = {...product, image: `${import.meta.env.VITE_API_BASE_URL}/api/image/${product.image}`}
    },
    setProducts: (state, products) => {
      products = products.map(product => {
        return {...product, image: `${import.meta.env.VITE_API_BASE_URL}/api/image/${product.image}`}
      });
      state.products.data = products
    },
    setProductLoading: (state, loading) => {
      state.currentProduct.loading = loading
    },
    setProductsLoading: (state, loading) => {
      state.products.loading = loading
    },
    setUser: (state, user) => {
      const userData = { _id: user._id, email: user.email, privileges: user.privileges }
      state.user.token = user.token;
      state.user.data = userData;
      sessionStorage.setItem('TOKEN', user.token);
      sessionStorage.setItem('USER', JSON.stringify(userData));
    },
    removeProduct: (state, data) => {
      state.products.data = state.products.data.filter(product => product._id != data.id)
    },
    logout: (state) => {
      
      state.user.data = {};
      state.user.token = null;
      sessionStorage.removeItem('TOKEN');
      sessionStorage.removeItem('USER');
      router.push({
        name: "LoginView",
      });
    },
    notify: (state, {message, type}) => {
      const notificationId = state.notifications.index
      state.notifications.index += 1
      state.notifications.data.unshift({message, type, show: true, id: notificationId})
      setTimeout(() => {
        state.notifications.data = state.notifications.data.filter(notification => notification.id != notificationId)
      }, 3000);
    }
  },
  modules: {},
})

export default store;