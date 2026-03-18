import axios from 'axios';
import { getToken } from './keychain';

const fetchy = axios.create({
  baseURL: 'http://56.228.12.162:8000/'
});



fetchy.interceptors.request.use(
  async(config) => {
    const token = await getToken('userToken'); // Get token from storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = "application/json";
    console.log('Starting Request', JSON.stringify(config, null, 2))
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// fetchy.interceptors.response.use(response => {
//   console.log('Response:', JSON.stringify(response, null, 2))
//   //return response
// })

export default fetchy;

// Usage in your application:
// import fetchy from './axios';
// fetchy.get('/user').then(...);
