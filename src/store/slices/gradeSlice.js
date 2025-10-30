import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { gradeService } from "../../services/gradeServices";

// ---------------- ASYNC THUNKS ----------------

// Create a new grade
export const createGrade = createAsyncThunk(
  "grades/create",
  async (gradeData, { rejectWithValue }) => {
    try {
      const result = await gradeService.createGrade(gradeData);
      return result.grade; // backend returns { message, grade }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get all grades
export const getAllGrades = createAsyncThunk(
  "grades/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const result = await gradeService.getAllGrades();
     
      
      return result; // backend returns array of grades
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get grade by ID
export const getGradeById = createAsyncThunk(
  "grades/getById",
  async (id, { rejectWithValue }) => {
    try {
      const result = await gradeService.getGradeById(id);
      return result; // single grade object
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update grade
export const updateGrade = createAsyncThunk(
  "grades/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await gradeService.updateGrade(id, data);
      return result.grade; // backend returns { message, grade }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete grade
export const deleteGrade = createAsyncThunk(
  "grades/delete",
  async (id, { rejectWithValue }) => {
    try {
      const result = await gradeService.deleteGrade(id);
      return id; // we just return the deleted ID to remove it locally
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



// ---------------- SLICE ----------------
const gradeSlice = createSlice({
  name: "grades",
  initialState: {
    grades: [],
    selectedGrade: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearGradeState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createGrade.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGrade.fulfilled, (state, action) => {
        state.loading = false;
        state.grades.push(action.payload);
        state.success = "Grade created successfully!";
      })
      .addCase(createGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllGrades.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllGrades.fulfilled, (state, action) => {
        state.loading = false;
        state.grades = action.payload;
      })
      .addCase(getAllGrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getGradeById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGradeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGrade = action.payload;
      })
      .addCase(getGradeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateGrade.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGrade.fulfilled, (state, action) => {
        state.loading = false;
        state.grades = state.grades.map((grade) =>
          grade._id === action.payload._id ? action.payload : grade
        );
        state.success = "Grade updated successfully!";
      })
      .addCase(updateGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteGrade.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGrade.fulfilled, (state, action) => {
        state.loading = false;
        state.grades = state.grades.filter((g) => g._id !== action.payload);
        state.success = "Grade deleted successfully!";
      })
      .addCase(deleteGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGradeState } = gradeSlice.actions;
export default gradeSlice.reducer;
