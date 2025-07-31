import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import projectSlice from "./slices/projectSlice"
import taskSlice from "./slices/taskSlice"
import notificationSlice from "./slices/notificationSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    projects: projectSlice,
    tasks: taskSlice,
    notifications: notificationSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
