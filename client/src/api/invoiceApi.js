import api from "./axios";

export const fetchDashboardStats = (month = "") =>
  api.get("/invoices/stats", { params: month ? { month } : {} });
export const fetchInvoices = (status = "") =>
  api.get("/invoices", { params: status ? { status } : {} });
export const fetchInvoiceById = (id) => api.get(`/invoices/${id}`);
export const createInvoice = (payload) => api.post("/invoices", payload);
export const markInvoicePaid = (id) => api.patch(`/invoices/${id}/mark-paid`);
export const deleteInvoice = (id) => api.delete(`/invoices/${id}`);
export const downloadInvoice = (id) =>
  api.get(`/pdf/${id}`, { responseType: "blob" });
export const sendInvoiceEmail = (id, payload = {}) => api.post(`/email/${id}`, payload);
