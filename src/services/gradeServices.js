import { apiService } from "./api.js";

class GradeService {
  // Create new grade
  async createGrade(data) {
    return await apiService.post("/grade", data);
  }

  // Get all grades
  async getAllGrades() {
    return await apiService.get("/grade");
  }

  // Get single grade by ID
  async getGradeById(id) {
    return await apiService.get(`/grade/${id}`);
  }

  // Update grade by ID
  async updateGrade(id, data) {
    return await apiService.patch(`/grade/${id}`, data);
  }

  // Delete grade by ID
  async deleteGrade(id) {
    return await apiService.delete(`/grade/${id}`);
  }
}

export const gradeService = new GradeService();
export default gradeService;
