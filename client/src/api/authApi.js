import api from "./axios";

export const registerUser = (payload) => api.post("/auth/register", payload);
export const loginUser = (payload) => api.post("/auth/login", payload);
export const getMe = () => api.get("/auth/me");
export const updateProfile = (payload) => api.put("/auth/profile", payload);

export const uploadLogo = (file) => {
  const formData = new FormData();
  formData.append("logo", file);
  return api.post("/auth/profile/logo", formData);
};
