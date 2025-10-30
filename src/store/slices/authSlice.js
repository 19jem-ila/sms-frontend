// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import  {authService}  from "../../services/authService"

// // -------------------- LOGIN --------------------
// export const login = createAsyncThunk(
//   "auth/login",
//   async ({ email, password }, thunkAPI) => {
//     try {
//       const user = await authService.login(email, password);
//       return user; // user info
//     } catch (error) {
//       const message =
//         error.response?.data?.message || error.message || "Login failed";
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // -------------------- LOGOUT --------------------
// export const logout = createAsyncThunk("auth/logout", async () => {
//   authService.logout();
// });

// // -------------------- CHANGE PASSWORD --------------------
// export const changePassword = createAsyncThunk(
//   "auth/changePassword",
//   async ({ currentPassword, newPassword }, thunkAPI) => {
//     try {
//       const res = await authService.changePassword(
//         currentPassword,
//         newPassword
//       );
//       return res.message;
//     } catch (error) {
//       const message =
//         error.response?.data?.message || error.message || "Change password failed";
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // -------------------- FORGOT PASSWORD --------------------
// export const forgotPassword = createAsyncThunk(
//   "auth/forgotPassword",
//   async (email, thunkAPI) => {
//     try {
//       const res = await authService.forgotPassword(email);
//       return res.message;
//     } catch (error) {
//       const message =
//         error.response?.data?.message || error.message || "Forgot password failed";
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // -------------------- RESET PASSWORD --------------------
// export const resetPassword = createAsyncThunk(
//   "auth/resetPassword",
//   async ({ token, newPassword }, thunkAPI) => {
//     try {
//       const res = await authService.resetPassword(token, newPassword);
//       return res.message;
//     } catch (error) {
//       const message =
//         error.response?.data?.message || error.message || "Reset password failed";
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// // -------------------- INITIAL STATE --------------------
// const storedUser = localStorage.getItem("user");

// const initialState = {
//   user: storedUser ? JSON.parse(storedUser) : null,
//   token: localStorage.getItem("accessToken") || null,
//   isLoading: false,
//   isError: false,
//   isSuccess: false,
//   message: "",
// };

// // -------------------- SLICE --------------------
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     resetState: (state) => {
//       state.isLoading = false;
//       state.isError = false;
//       state.isSuccess = false;
//       state.message = "";
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // LOGIN
//       .addCase(login.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.user = action.payload;
//         state.token = localStorage.getItem("accessToken");
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//         state.user = null;
//         state.token = null;
//       })

//       // LOGOUT
//       .addCase(logout.fulfilled, (state) => {
//         state.user = null;
//         state.token = null;
//       })

//       // CHANGE PASSWORD
//       .addCase(changePassword.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(changePassword.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.message = action.payload;
//       })
//       .addCase(changePassword.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//       })

//       // FORGOT PASSWORD
//       .addCase(forgotPassword.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(forgotPassword.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.message = action.payload;
//       })
//       .addCase(forgotPassword.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//       })

//       // RESET PASSWORD
//       .addCase(resetPassword.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(resetPassword.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.message = action.payload;
//       })
//       .addCase(resetPassword.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//       });
//   },
// });

// export const { resetState } = authSlice.actions;
// export default authSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

// -------------------- LOGIN --------------------
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const user = await authService.login(email, password);
      return user;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// -------------------- LOGOUT --------------------
export const logout = createAsyncThunk("auth/logout", async () => {
  authService.logout();
});

// -------------------- CHANGE PASSWORD --------------------
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ currentPassword, newPassword }, thunkAPI) => {
    try {
      const res = await authService.changePassword(currentPassword, newPassword);
      return res.message;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Change password failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// -------------------- FORGOT PASSWORD --------------------
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const res = await authService.forgotPassword(email);
      return res.message;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Forgot password failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// -------------------- RESET PASSWORD --------------------
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, thunkAPI) => {
    try {
      const res = await authService.resetPassword(token, newPassword);
      return res.message;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Reset password failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// -------------------- CREATE ADMIN --------------------
export const createAdmin = createAsyncThunk(
  "auth/createAdmin",
  async (data, thunkAPI) => {
    try {
      const res = await authService.createAdmin(data);
      return res.message || "Admin created successfully";
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create admin";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// -------------------- CREATE USER --------------------
export const createUser = createAsyncThunk(
  "auth/createUser",
  async (data, thunkAPI) => {
    try {
      console.log("🚀 createUser thunk called with:", data);
      const res = await authService.createUser(data);
      console.log("✅ Backend success response:", res);
      return res.message || "User created successfully";
    } catch (error) {
      console.error("❌ Thunk error:", error.response?.data || error.message);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create user";
      return thunkAPI.rejectWithValue(message);
    }
  }
);


// -------------------- INITIAL STATE --------------------
const storedUser = localStorage.getItem("user");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem("accessToken") || null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// -------------------- SLICE --------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.token = localStorage.getItem("accessToken");
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })

      // CHANGE PASSWORD
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // CREATE ADMIN
      .addCase(createAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // CREATE USER
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetState } = authSlice.actions;
export default authSlice.reducer;


