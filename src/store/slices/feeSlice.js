import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { feeService } from "../../services/feeServices.js";

// ------------------- ASYNC THUNKS -------------------

// Create Fee
export const createFee = createAsyncThunk(
  "fees/create",
  async (feeData, { rejectWithValue }) => {
    try {
      const result = await feeService.createFee(feeData);
   
      
      return result.fee; // backend returns { message, fee }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get All Fees
export const getAllFees = createAsyncThunk(
  "fees/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const result = await feeService.getAllFees();
     
      return result; // backend returns an array
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get Fee by ID
export const getFeeById = createAsyncThunk(
  "fees/getById",
  async (id, { rejectWithValue }) => {
    try {
      const result = await feeService.getFeeById(id);
      return result; // single fee object
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Fee
export const updateFee = createAsyncThunk(
  "fees/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await feeService.updateFee(id, data);
      return result.fee; // backend returns { message, fee }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Fee
export const deleteFee = createAsyncThunk(
  "fees/delete",
  async (id, { rejectWithValue }) => {
    try {
      await feeService.deleteFee(id);
      return id; // return the deleted ID to update store
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ------------------- SLICE -------------------
const feeSlice = createSlice({
  name: "fees",
  initialState: {
    fees: [],
    selectedFee: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearFeeState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createFee.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFee.fulfilled, (state, action) => {
        state.loading = false;
        state.fees.push(action.payload);
        state.success = "Fee record created successfully!";
      })
      .addCase(createFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllFees.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllFees.fulfilled, (state, action) => {
        state.loading = false;
        state.fees = action.payload;
      })
      .addCase(getAllFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getFeeById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFee = action.payload;
      })
      .addCase(getFeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateFee.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFee.fulfilled, (state, action) => {
        state.loading = false;
        state.fees = state.fees.map((fee) =>
          fee._id === action.payload._id ? action.payload : fee
        );
        state.success = "Fee record updated successfully!";
      })
      .addCase(updateFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteFee.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFee.fulfilled, (state, action) => {
        state.loading = false;
        state.fees = state.fees.filter((fee) => fee._id !== action.payload);
        state.success = "Fee record deleted successfully!";
      })
      .addCase(deleteFee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFeeState } = feeSlice.actions;
export default feeSlice.reducer;
