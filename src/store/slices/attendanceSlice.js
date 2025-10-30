import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { attendanceService } from "../../services/attendanceServices.js";

// ------------------- ASYNC THUNKS -------------------

// Create Attendance
export const createAttendance = createAsyncThunk(
  "attendance/create",
  async (data, { rejectWithValue }) => {
    try {
      const result = await attendanceService.createAttendance(data);
      return result.attendance; // backend returns { message, attendance }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get All Attendance
export const getAllAttendance = createAsyncThunk(
  "attendance/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const result = await attendanceService.getAllAttendance();
     
      
      return result; // array of attendance records
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get Attendance by ID
export const getAttendanceById = createAsyncThunk(
  "attendance/getById",
  async (id, { rejectWithValue }) => {
    try {
      const result = await attendanceService.getAttendanceById(id);
      return result; // single attendance object
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Attendance
export const updateAttendance = createAsyncThunk(
  "attendance/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await attendanceService.updateAttendance(id, data);
      return result.attendance; // backend returns { message, attendance }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Attendance
export const deleteAttendance = createAsyncThunk(
  "attendance/delete",
  async (id, { rejectWithValue }) => {
    try {
      await attendanceService.deleteAttendance(id);
      return id; // return deleted ID for store
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ------------------- SLICE -------------------
const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    records: [],
    selectedRecord: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearAttendanceState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records.push(action.payload);
        state.success = "Attendance recorded successfully!";
      })
      .addCase(createAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(getAllAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getAttendanceById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAttendanceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRecord = action.payload;
      })
      .addCase(getAttendanceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.map((rec) =>
          rec._id === action.payload._id ? action.payload : rec
        );
        state.success = "Attendance updated successfully!";
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.filter((rec) => rec._id !== action.payload);
        state.success = "Attendance deleted successfully!";
      })
      .addCase(deleteAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAttendanceState } = attendanceSlice.actions;
export default attendanceSlice.reducer;
