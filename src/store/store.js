import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js"; 
import userReducer from "./slices/userSlice.js" ;
import studentReducer from "./slices/studentSlice.js";
import subjectReducer from "./slices/subjectSlice.js";
import gradeReducer  from "./slices/gradeSlice.js";
import feeReducer from  "./slices/feeSlice.js";
import classReducer from "./slices/classSlice.js";
import attendanceReducer from "./slices/attendanceSlice.js"
import academicTermReducer from "./slices/academicTermSlice.js"


export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    student: studentReducer,
    subject: subjectReducer,
    grade: gradeReducer,
    fee : feeReducer,
    class : classReducer,
    attendance : attendanceReducer,
    term : academicTermReducer

  },
});
