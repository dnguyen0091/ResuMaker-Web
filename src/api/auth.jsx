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

export const apiForgotPassword = async(email) => {
  const response = await axios.post(`${API_URL}/auth/forgotPassword`, { email });
  return response.data;
}

export const apiVerifyEmail = async(email, verificationCode) => {
  const response = await axios.post(`${API_URL}/auth/verifyEmail`, { email, verificationCode });
  return response.data;
}

export const apiUpdatePassword = async(email, password) => {
  const response = await axios.post(`${API_URL}/auth/updatePassword`, { email, password });
  return response.data;
}

export const apiVerifyForgot = async(email, verificationCode) => {
  const response = await axios.post(`${API_URL}/auth/verifyForgot`, { email, verificationCode });
  return response.data;
}