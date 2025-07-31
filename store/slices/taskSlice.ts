import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "high" | "medium" | "low"
  assignedTo: string
  assignedToName: string
  projectId: string
  createdBy: string
  createdAt: string
  updatedAt: string
  dueDate?: string
}

export interface TaskLog {
  id: string
  taskId: string
  action: string
  oldValue?: string
  newValue?: string
  userId: string
  userName: string
  timestamp: string
}

interface TaskState {
  tasks: Task[]
  taskLogs: TaskLog[]
  isLoading: boolean
  error: string | null
  filters: {
    status: string
    priority: string
    assignedTo: string
  }
  currentPage: number
  totalPages: number
}

const initialState: TaskState = {
  tasks: [],
  taskLogs: [],
  isLoading: false,
  error: null,
  filters: {
    status: "all",
    priority: "all",
    assignedTo: "all",
  },
  currentPage: 1,
  totalPages: 1,
}

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setTasks: (state, action: PayloadAction<{ tasks: Task[]; totalPages: number }>) => {
      state.tasks = action.payload.tasks
      state.totalPages = action.payload.totalPages
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.unshift(action.payload)
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.tasks[index] = action.payload
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload)
    },
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setTaskLogs: (state, action: PayloadAction<TaskLog[]>) => {
      state.taskLogs = action.payload
    },
    addTaskLog: (state, action: PayloadAction<TaskLog>) => {
      state.taskLogs.unshift(action.payload)
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setLoading,
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setFilters,
  setCurrentPage,
  setTaskLogs,
  addTaskLog,
  setError,
} = taskSlice.actions

export default taskSlice.reducer
