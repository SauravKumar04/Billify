import api from "./axios";

export const generateReminder = (invoiceId, payload) =>
  api.post(`/ai/reminder/${invoiceId}`, payload);
