import { apiRequest } from "./api.js";

export const companyApi = {
  create: (payload) => apiRequest("/company", { method: "POST", body: payload, auth: true }),

  getMine: () => apiRequest("/company", { method: "GET", auth: true }),
};
