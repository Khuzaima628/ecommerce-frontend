import { apiRequest } from "./api.js";

export const productApi = {
  create: (payload) => apiRequest("/product", { method: "POST", body: payload, auth: true }),

  listMine: () => apiRequest("/products", { method: "GET", auth: true }),

  /** Public catalog for customers. filters: category, search, minPrice, maxPrice, page, limit. */
  listAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") params.set(key, value);
    });
    const qs = params.toString();
    return apiRequest(`/all-products${qs ? `?${qs}` : ""}`, { method: "GET", auth: true });
  },

  getOne: (pid) => apiRequest(`/product/${pid}`, { method: "GET", auth: true }),

  update: (pid, patch) =>
    apiRequest(`/product/${pid}`, { method: "PATCH", body: patch, auth: true }),

  remove: (pid) => apiRequest(`/product/${pid}`, { method: "DELETE", auth: true }),

  toggleHide: (pid) => apiRequest(`/product/hide/${pid}`, { method: "PATCH", auth: true }),

  changeStock: (pid, change) =>
    apiRequest(`/product/increase-stock/${pid}`, { method: "PUT", body: { change }, auth: true }),
};
