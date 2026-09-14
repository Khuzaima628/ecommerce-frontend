import { apiRequest } from "./api.js";

export const authApi = {
  signup: (payload) => apiRequest("/auth/signup", { method: "POST", body: payload }),

  verifyOtp: (email, otp) =>
    apiRequest("/auth/otp-verify", { method: "POST", body: { email, otp: Number(otp) } }),

  login: (email, password) =>
    apiRequest("/auth/login", { method: "POST", body: { email, password } }),

  forgotPassword: (email) =>
    apiRequest("/auth/forgot-password", { method: "POST", body: { email } }),

  verifyForgotPasswordOtp: (email, otp) =>
    apiRequest("/auth/verify-forgot-password-otp", {
      method: "POST",
      body: { email, otp: Number(otp) },
    }),

  resetPassword: (resetToken, newPassword, confirmPassword) =>
    apiRequest("/auth/reset-password", {
      method: "POST",
      body: { resetToken, newPassword, confirmPassword },
    }),

  getMe: () => apiRequest("/auth/get-me", { method: "GET", auth: true }),

  updateMe: (patch) => apiRequest("/auth/get-me", { method: "PATCH", body: patch, auth: true }),
};
