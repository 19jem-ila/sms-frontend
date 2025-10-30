import { apiService } from "./api.js";

class AttendanceService {
  // Create attendance record
  async createAttendance(data) {
    return await apiService.post("/attendance", data);
  }

  // Get all attendance records
  async getAllAttendance() {
    return await apiService.get("/attendance");
  }

  // Get single attendance record by ID
  async getAttendanceById(id) {
    return await apiService.get(`/attendance/${id}`);
  }

  // Update attendance record by ID
  async updateAttendance(id, data) {
    return await apiService.patch(`/attendance/${id}`, data);
  }

  // Delete attendance record by ID
  async deleteAttendance(id) {
    return await apiService.delete(`/attendance/${id}`);
  }
}

export const attendanceService = new AttendanceService();
export default attendanceService;
