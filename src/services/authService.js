import apiService from "./api.js";

class AuthService {
  // -------------------- LOGIN --------------------
  async login(email, password) {
    const data = await apiService.post("/auth/login", { email, password });

    // Store token + user info
    localStorage.setItem("accessToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data.user;
  }

  // -------------------- LOGOUT --------------------
  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }

  // -------------------- GET CURRENT USER --------------------
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  // -------------------- GET TOKEN --------------------
  getToken() {
    return localStorage.getItem("accessToken");
  }

  // -------------------- REFRESH TOKEN (optional) --------------------
  async refreshToken() {
    // 🔹 In your backend, you don't have a refresh endpoint yet,
    // but if you add one later, this will handle it.
    // For now, we'll just revalidate the token by re-login or similar.
    const token = this.getToken();
    if (!token) throw new Error("No token to refresh");

    // Optionally, you could check token expiration here.
    // For now, just return the existing token.
    return token;
  }

  // -------------------- CLEAR TOKENS --------------------
  clearTokens() {
    this.logout();
  }

  // -------------------- CREATE FIRST ADMIN --------------------
  async createAdmin(data) {
    return apiService.post("/auth/create-admin", data);
  }

  // -------------------- CREATE USER (admin only) --------------------
  async createUser(data) {
    try {
      console.log("📦 Sending user data:", data); // log before sending
      const response = await apiService.post("/auth/create-user", data);
      console.log("✅ Server response:", response);
      return response;
    } catch (error) {
      console.error("❌ createUser failed:", error.response?.data || error.message);
      throw error; // rethrow to your thunk
    }
  }
  

  // -------------------- CHANGE PASSWORD --------------------
  async changePassword(currentPassword, newPassword) {
    return apiService.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  }

  // -------------------- FORGOT PASSWORD --------------------
  async forgotPassword(email) {
    return apiService.post("/auth/forgot-password", { email });
  }

  // -------------------- RESET PASSWORD --------------------
  async resetPassword(token, newPassword) {
    return apiService.post(`/auth/reset-password/${token}`, { newPassword });
  }
}

export const authService = new AuthService();
export default authService;
