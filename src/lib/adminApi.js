import { apiRequest } from "./api.js";

export const adminApi = {
  orders: (status) => {
    const qs = status && status !== "all" ? `?status=${status}` : "";
    return apiRequest(`/admin/orders${qs}`, { method: "GET", auth: true });
  },

  users: (role) => {
    const qs = role && role !== "all" ? `?role=${role}` : "";
    return apiRequest(`/admin/users${qs}`, { method: "GET", auth: true });
  },

  products: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "" && v !== "all") params.set(k, v);
    });
    const qs = params.toString();
    return apiRequest(`/admin/products${qs ? `?${qs}` : ""}`, { method: "GET", auth: true });
  },
};
