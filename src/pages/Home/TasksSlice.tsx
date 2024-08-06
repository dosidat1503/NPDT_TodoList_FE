import { TaskInfoCard } from "../../components/TaskCard/TaskCard";
import { createSlice } from "@reduxjs/toolkit";

export interface InitialState {
  tasks: TaskInfoCard[];
}

const initialState: InitialState = {
  tasks: [],
};

export default createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    updateState: (state, action) => {
      state.tasks = state.tasks.map((item) => {
        if (item.taskID === action.payload) item.isComplete = !item.isComplete; 
        return item;
      });
    },
    watch: (state, action) => {
      state.tasks = state.tasks.map((item) => {
        if (item.taskID === action.payload) item.isWatching = !item.isWatching;
        else item.isWatching = false;
        return item;
      });
    },
    delete: (state, action) => {
      state.tasks.splice(action.payload, 1);
    },
  },
});
