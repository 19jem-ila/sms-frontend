import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../services/userService.js";

// ------------------- Async Thunks -------------------

// Fetch all users (admins + teachers)
export const fetchUsers = createAsyncThunk("users/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await userService.getAllUsers();
   
    return response;
    
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Fetch single user
export const fetchUserById = createAsyncThunk("users/fetchById", async (id, thunkAPI) => {
  try {
    const response = await userService.getUserById(id);
    
    return response;
    
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Update user
export const updateUser = createAsyncThunk("users/update", async ({ id, data }, thunkAPI) => {
  try {
    const response =  await userService.updateUser(id, data);
   
    return response;
    
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Delete user
export const deleteUser = createAsyncThunk("users/delete", async (id, thunkAPI) => {
  try {
    await userService.deleteUser(id);
    return id; // Return the deleted user ID for state update
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Reset user password (admin only)
export const resetUserPassword = createAsyncThunk("users/resetPassword", async (id, thunkAPI) => {
  try {
    const response = await userService.resetUserPassword(id);
    return response.message || "Password reset successfully";
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// ------------------- Slice -------------------

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    currentUser: null,
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
      // ----------- FETCH ALL -----------
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----------- FETCH BY ID -----------
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----------- UPDATE USER -----------
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
      
        // Handle both possible response shapes
        const updated = action.payload.user || action.payload;
        state.successMessage = action.payload.message || "User updated successfully";
      
        // Update in list if present
        state.list = state.list.map((u) => (u._id === updated._id ? updated : u));
      
        // Update current user too (for profile editing)
        if (state.currentUser && state.currentUser._id === updated._id) {
          state.currentUser = updated;
        }
      })
      
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----------- DELETE USER -----------
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.successMessage = "User deleted successfully";
        state.list = state.list.filter((u) => u._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ----------- RESET PASSWORD -----------
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.successMessage = action.payload;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = userSlice.actions;
export default userSlice.reducer;
