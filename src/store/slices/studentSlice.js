import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { studentService } from "../../services/studentServices.js";

// ------------------- Async Thunks -------------------

// Create student
export const createStudent = createAsyncThunk("students/create", async (data, thunkAPI) => {
  try {
    return await studentService.createStudent(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Fetch all students
export const fetchStudents = createAsyncThunk("students/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await studentService.getAllStudents();
       
    return response
    

  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Fetch single student
export const fetchStudentById = createAsyncThunk("students/fetchById", async (id, thunkAPI) => {
  try {
    return await studentService.getStudentById(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Update student
export const updateStudent = createAsyncThunk("students/update", async ({ id, data }, thunkAPI) => {
  try {
    return await studentService.updateStudent(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Delete student
export const deleteStudent = createAsyncThunk("students/delete", async (id, thunkAPI) => {
  try {
    await studentService.deleteStudent(id);
    return id; // return id so we can remove it from state
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// ------------------- Slice -------------------

const studentSlice = createSlice({
  name: "students",
  initialState: {
    list: [],
    currentStudent: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // -------- CREATE STUDENT --------
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Student created successfully";
        state.list.push(action.payload.student);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- FETCH ALL --------
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- FETCH BY ID --------
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStudent = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- UPDATE --------
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Student updated successfully";
        const updated = action.payload.student;
        state.list = state.list.map((s) => (s._id === updated._id ? updated : s));
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- DELETE --------
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.successMessage = "Student deleted successfully";
        state.list = state.list.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = studentSlice.actions;
export default studentSlice.reducer;
