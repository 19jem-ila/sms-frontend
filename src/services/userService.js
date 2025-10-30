
import { apiService } from "./api.js";

class UserService {
  // ---------------- GET ALL USERS ----------------
  async getAllUsers() {
    return apiService.get("/user");
  }

  // ---------------- GET SINGLE USER ----------------
  async getUserById(id) {
    return apiService.get(`/user/${id}`);
  }

  // ---------------- UPDATE USER ----------------
  async updateUser(id, data) {
    return apiService.patch(`/user/${id}`, data);
  }

  // ---------------- DELETE USER ----------------
  async deleteUser(id) {
    return apiService.delete(`/user/${id}`);
  }

  // ---------------- RESET USER PASSWORD ----------------
  async resetUserPassword(id) {
    return apiService.post(`/user/${id}/reset-password`);
  }
}

// ✅ Export a single instance
export const userService = new UserService();
export default userService;
