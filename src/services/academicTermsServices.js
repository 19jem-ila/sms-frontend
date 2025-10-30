import { apiService } from "./api.js";

class AcademicTermService {
  // Create a new term
  async createTerm(data) {
    return await apiService.post("/term", data);
  }

  // Get all terms
  async getAllTerms() {
    return await apiService.get("/term");
  }

  // Get term by ID
  async getTermById(id) {
    return await apiService.get(`/term/${id}`);
  }

  // Update term by ID
  async updateTerm(id, data) {
    return await apiService.patch(`/term/${id}`, data);
  }

  // Delete term by ID
  async deleteTerm(id) {
    return await apiService.delete(`/term/${id}`);
  }
}

export const academicTermService = new AcademicTermService();
export default academicTermService;
