import { apiService } from "./api.js";

class ClassService {
  // Create new class
  async createClass(data) {
    return await apiService.post("/class", data);
  }

  // Get all classes
  async getAllClasses() {
    return await apiService.get("/class");
  }

  // Get single class by ID
  async getClassById(id) {
    return await apiService.get(`/class/${id}`);
  }

  // Update class by ID
  async updateClass(id, data) {
    return await apiService.patch(`/class/${id}`, data);
  }

  // Delete class by ID
  async deleteClass(id) {
    return await apiService.delete(`/class/${id}`);
  }
}

export const classService = new ClassService();
export default classService;
