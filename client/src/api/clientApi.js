import api from "./axios";

export const fetchClients = () => api.get("/clients");
export const createClient = (payload) => api.post("/clients", payload);
export const editClient = (id, payload) => api.put(`/clients/${id}`, payload);
export const removeClient = (id) => api.delete(`/clients/${id}`);
