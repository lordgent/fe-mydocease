import api from "./api";

export const AuthService = {

  async register(data) {
    const response = await api.post("/register", data);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post("/login", credentials);
    if (response.data.token) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }
    return response.data;
  },

  async verifyOtp(email, otpCode) {
    const response = await api.post("/verify-otp", {
      email: email,
      otp_code: otpCode,
    });
    return response.data;
  },

  async requestForgotPasswordOtp(email) {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  },

  async verifyForgotPasswordOtp(email, otp) {
    const response = await api.post("/verify-forgot-otp", {
      email: email,
      otp_code: otp,
    });
    return response.data;
  },

  async resetPassword(email, otpCode, password, passwordConfirmation) {
    const response = await api.post("/reset-password", {
      email: email,
      otp_code: otpCode,
      password: password,
      password_confirmation: passwordConfirmation,
    });
    return response.data;
  },

  /** * Helpers 
   */
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  setToken(token) {
    localStorage.setItem("token", token);
  },

  getToken() {
    return localStorage.getItem("token");
  },

  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};