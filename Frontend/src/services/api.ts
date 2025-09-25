import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // change to your Django backend
});

export const getNews = () => API.get('/news/');
export const postActivity = (data) => API.post('/activity/', data);

export default API;
