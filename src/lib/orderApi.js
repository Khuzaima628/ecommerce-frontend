import { apiRequest } from "./api.js";

export const orderApi = {
  create: () => apiRequest("/order", { method: "POST", auth: true }),

  list: () => apiRequest("/order", { method: "GET", auth: true }),

  getOne: (oid) => apiRequest(`/order/${oid}`, { method: "GET", auth: true }),

  cancel: (oid) => apiRequest(`/order/${oid}/cancel`, { method: "PATCH", auth: true }),

  checkout: (oid) => apiRequest(`/order/${oid}/checkout`, { method: "POST", auth: true }),

  sellerDashboard: () => apiRequest("/seller/dashboard", { method: "GET", auth: true }),

  sellerOrders: () => apiRequest("/seller/orders", { method: "GET", auth: true }),

  updateSellerOrderStatus: (oid, status) =>
    apiRequest(`/seller/orders/${oid}/status`, { method: "PATCH", body: { status }, auth: true }),
};
