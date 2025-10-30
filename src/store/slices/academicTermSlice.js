import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { academicTermService } from "../../services/academicTermsServices.js";

// ------------------- ASYNC THUNKS -------------------

// Create Term
export const createTerm = createAsyncThunk(
  "term/create",
  async (data, { rejectWithValue }) => {
    try {
      const result = await academicTermService.createTerm(data);
      return result.term; // backend returns { message, term }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get All Terms
export const getAllTerms = createAsyncThunk(
  "term/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const result = await academicTermService.getAllTerms();
      
       
      return result; // array of terms
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get Term by ID
export const getTermById = createAsyncThunk(
  "term/getById",
  async (id, { rejectWithValue }) => {
    try {
      const result = await academicTermService.getTermById(id);
      return result; // single term object
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Term
export const updateTerm = createAsyncThunk(
  "term/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await academicTermService.updateTerm(id, data);
      return result.term;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Term
export const deleteTerm = createAsyncThunk(
  "term/delete",
  async (id, { rejectWithValue }) => {
    try {
      await academicTermService.deleteTerm(id);
      return id; // return deleted ID
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ------------------- SLICE -------------------
const academicTermSlice = createSlice({
  name: "term",
  initialState: {
    terms: [],
    selectedTerm: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearTermState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createTerm.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTerm.fulfilled, (state, action) => {
        state.loading = false;
        state.terms.push(action.payload);
        state.success = "Term created successfully!";
      })
      .addCase(createTerm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllTerms.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTerms.fulfilled, (state, action) => {
        state.loading = false;
        state.terms = action.payload;
      })
      .addCase(getAllTerms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getTermById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTermById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTerm = action.payload;
      })
      .addCase(getTermById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateTerm.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTerm.fulfilled, (state, action) => {
        state.loading = false;
        state.terms = state.terms.map((term) =>
          term._id === action.payload._id ? action.payload : term
        );
        state.success = "Term updated successfully!";
      })
      .addCase(updateTerm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteTerm.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTerm.fulfilled, (state, action) => {
        state.loading = false;
        state.terms = state.terms.filter((term) => term._id !== action.payload);
        state.success = "Term deleted successfully!";
      })
      .addCase(deleteTerm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTermState } = academicTermSlice.actions;
export default academicTermSlice.reducer;
