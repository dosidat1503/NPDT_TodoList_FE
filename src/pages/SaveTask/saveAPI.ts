import request from "../../utils/request";
import { TaskInfoSave } from "../SaveTask/saveType";
import { TaskServer } from "../Home/homeType";

export interface Response {
  message: string;
}

export const addTask = async (taskData: TaskInfoSave) => {
  const response = await request.post<Response>("/api/addTask", taskData);
  return response.data;
};

export const updateTask = async (updateData: TaskInfoSave) => {
  const response = await request.put<Response>("/api/updateTask", updateData);
  return response.data;
};

export const getTask = async (taskID: number) => {
  const response = await request.get<TaskServer>(`/api/getTask/${taskID}`);
  return response.data;
};
