import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

export const fetchCommunities = () =>
  axios.get(`${BASE_URL}/communities`).then((res) => res.data);

export const fetchPosts = () =>
  axios.get(`${BASE_URL}/posts`).then((res) => res.data);

export const createPost = (postData) =>
  axios.post(`${BASE_URL}/posts`, postData).then((res) => res.data);
