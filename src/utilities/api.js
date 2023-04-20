import axios from "axios";

const api = axios.create({
  baseURL: "https://tiendabackend.azurewebsites.net/api/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status == 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;
