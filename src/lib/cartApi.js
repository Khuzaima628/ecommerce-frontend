import { apiRequest } from "./api.js";

export const cartApi = {
  add: (productId, quantity) =>
    apiRequest(`/cart/${productId}`, { method: "POST", body: { quantity }, auth: true }),

  update: (productId, quantity) =>
    apiRequest(`/cart/${productId}`, { method: "PUT", body: { quantity }, auth: true }),

  list: () => apiRequest("/cart", { method: "GET", auth: true }),
 
  remove: (productId) => apiRequest(`/cart/${productId}`, { method: "DELETE", auth: true }),
};
