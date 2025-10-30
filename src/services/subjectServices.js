import apiService from "./api.js";

class SubjectService {
  // ✅ Get all subjects (admin & teacher)
  async getAllSubjects() {
    return await apiService.get("/subject");
  }

  // ✅ Get a single subject by ID
  async getSubjectById(id) {
    return await apiService.get(`/subject/${id}`);
  }

  // ✅ Create a new subject (admin only)
  async createSubject(data) {
    return await apiService.post("/subject", data);
  }

  // ✅ Update an existing subject (admin only)
  async updateSubject(id, data) {
    return await apiService.patch(`/subject/${id}`, data);
  }

  // ✅ Delete a subject (admin only)
  async deleteSubject(id) {
    return await apiService.delete(`/subject/${id}`);
  }
}

export const subjectService = new SubjectService();
export default subjectService;
