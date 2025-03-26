import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const apiLoginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
}

export const apiRegisterUser = async (firstName, lastName, email, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, { firstName, lastName, email, password });
  return response.data;
}

export const apiCheckExists = async (email) => {
  const response = await axios.post(`${API_URL}/auth/checkExists`, { email });
  return response.data;
}