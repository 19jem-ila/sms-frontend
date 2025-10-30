import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { subjectService } from "../../services/subjectServices.js";

// ------------------- ASYNC THUNKS -------------------

// Get all subjects
export const fetchSubjects = createAsyncThunk(
  "subjects/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response =await subjectService.getAllSubjects();
      
      return response ;
      
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch subjects");
    }
  }
);

// Get one subject
export const fetchSubjectById = createAsyncThunk(
  "subjects/fetchById",
  async (id, thunkAPI) => {
    try {
      return await subjectService.getSubjectById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch subject");
    }
  }
);

// Create new subject
export const createSubject = createAsyncThunk(
  "subjects/create",
  async (data, thunkAPI) => {
    try {
      return await subjectService.createSubject(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to create subject");
    }
  }
);

// Update subject
export const updateSubject = createAsyncThunk(
  "subjects/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await subjectService.updateSubject(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to update subject");
    }
  }
);

// Delete subject
export const deleteSubject = createAsyncThunk(
  "subjects/delete",
  async (id, thunkAPI) => {
    try {
      return await subjectService.deleteSubject(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to delete subject");
    }
  }
);



// ------------------- SLICE -------------------
const subjectSlice = createSlice({
  name: "subjects",
  initialState: {
    subjects: [],
    selectedSubject: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSubjectState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------- FETCH ALL ----------
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------- FETCH BY ID ----------
      .addCase(fetchSubjectById.fulfilled, (state, action) => {
        state.selectedSubject = action.payload;
      })

      // ---------- CREATE ----------
      .addCase(createSubject.fulfilled, (state, action) => {
        state.subjects.push(action.payload.subject);
        state.successMessage = action.payload.message;
      })

      // ---------- UPDATE ----------
      .addCase(updateSubject.fulfilled, (state, action) => {
        const updated = action.payload.subject;
        const index = state.subjects.findIndex((s) => s._id === updated._id);
        if (index !== -1) state.subjects[index] = updated;
        state.successMessage = action.payload.message;
      })

      // ---------- DELETE ----------
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.subjects = state.subjects.filter(
          (subject) => subject._id !== action.meta.arg
        );
        state.successMessage = action.payload.message;
      })

      // ---------- GENERAL REJECTIONS ----------
      .addMatcher(
        (action) => action.type.startsWith("subjects/") && action.type.endsWith("rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearSubjectState } = subjectSlice.actions;
export default subjectSlice.reducer;
