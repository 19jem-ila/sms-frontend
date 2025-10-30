import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { classService } from "../../services/classServices";

// ------------------- ASYNC THUNKS -------------------

// Create Class
export const createClass = createAsyncThunk(
  "classes/create",
  async (classData, { rejectWithValue }) => {
    try {
      const result = await classService.createClass(classData);
      return result.class; // backend returns { message, class }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get All Classes
export const getAllClasses = createAsyncThunk(
  "classes/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const result = await classService.getAllClasses();
      
      
      return result; // array of classes
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get Class by ID
export const getClassById = createAsyncThunk(
  "classes/getById",
  async (id, { rejectWithValue }) => {
    try {
      const result = await classService.getClassById(id);
      
      
      return result; // single class object
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Class
export const updateClass = createAsyncThunk(
  "classes/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await classService.updateClass(id, data);
      return result.class; // backend returns { message, class }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Class
export const deleteClass = createAsyncThunk(
  "classes/delete",
  async (id, { rejectWithValue }) => {
    try {
      await classService.deleteClass(id);
      return id; // return deleted ID for store
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ------------------- SLICE -------------------
const classSlice = createSlice({
  name: "classes",
  initialState: {
    classes: [],
    selectedClass: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearClassState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createClass.pending, (state) => {
        state.loading = true;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes.push(action.payload);
        state.success = "Class created successfully!";
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllClasses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(getAllClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getClassById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClassById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClass = action.payload;
      })
      .addCase(getClassById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateClass.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = state.classes.map((cls) =>
          cls._id === action.payload._id ? action.payload : cls
        );
        state.success = "Class updated successfully!";
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = state.classes.filter((cls) => cls._id !== action.payload);
        state.success = "Class deleted successfully!";
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearClassState } = classSlice.actions;
export default classSlice.reducer;
