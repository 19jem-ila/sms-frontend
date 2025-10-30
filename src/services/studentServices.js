import { apiService } from "./api.js";

class StudentService {
  // ---------------- CREATE STUDENT ----------------
  async createStudent(data) {
    return apiService.post("/student", data);
  }

  // ---------------- GET ALL STUDENTS ----------------
  async getAllStudents() {
    return apiService.get("/student");
  }

  // ---------------- GET SINGLE STUDENT ----------------
  async getStudentById(id) {
    return apiService.get(`/student/${id}`);
  }

  // ---------------- UPDATE STUDENT ----------------
  async updateStudent(id, data) {
    return apiService.patch(`/student/${id}`, data);
  }

  // ---------------- DELETE STUDENT ----------------
  async deleteStudent(id) {
    return apiService.delete(`/student/${id}`);
  }
}

// ✅ Export single instance
export const studentService = new StudentService();
export default studentService;
