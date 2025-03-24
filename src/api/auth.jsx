import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const apiLoginUser = async (login, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { login, password });
  return response.data;
}

export const apiRegisterUser = async (firstName, lastName, login, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, { firstName, lastName, login, password });
  return response.data;
}