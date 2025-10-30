import { apiService } from "./api.js";

class FeeService {
  // Create new fee record
  async createFee(data) {
    return await apiService.post("/fee", data);
  }

  // Get all fees
  async getAllFees() {
    return await apiService.get("/fee");
  }

  // Get single fee by ID
  async getFeeById(id) {
    return await apiService.get(`/fee/${id}`);
  }

  // Update fee by ID
  async updateFee(id, data) {
    return await apiService.patch(`/fee/${id}`, data);
  }

  // Delete fee by ID
  async deleteFee(id) {
    return await apiService.delete(`/fee/${id}`);
  }
}

export const feeService = new FeeService();
export default feeService;
