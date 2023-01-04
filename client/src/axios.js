import axios from 'axios';
import store from './store'

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`
})
axiosClient.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${store.state.user.token}`
  return config;
})

axiosClient.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  switch (error.response.status) {
    case 401:
      store.commit('logout')
      store.commit("notify", {
        type: "information",
        message: "Sesja wygasła, zaloguj się ponownie",
      });
      break;
  
    default:
      break;
  }
  return Promise.reject(error);
});

export default axiosClient;