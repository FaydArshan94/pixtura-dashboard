import axios from 'axios';

const instance = axios.create({
    // baseURL: 'http://52.66.89.180:5000', // Replace with your API base URL
    baseURL: 'https://imagix.duckdns.org', // Replace with your API base URL
    withCredentials: true, // Include credentials in requests
})



instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;