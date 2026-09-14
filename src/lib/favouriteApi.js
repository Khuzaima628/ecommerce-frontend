import { apiRequest } from "./api.js";

export const favouriteApi = {
  toggle: (pid) => apiRequest(`/product/favourite/${pid}`, { method: "POST", auth: true }),

  list: () => apiRequest("/product/favourite", { method: "GET", auth: true }),
};
