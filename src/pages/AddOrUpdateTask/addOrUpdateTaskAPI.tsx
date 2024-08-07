import request from "../../utils/request";
import { TaskInfoAddOrUpdate } from "./AddOrUpdateTask";

export interface Response {
  message: string;
}

export const addTask = async (taskData: TaskInfoAddOrUpdate) => {
  const response = await request.post<Response>("/api/addTask", taskData);
  return response.data;
}

export const updateTask = async (updateData: TaskInfoAddOrUpdate) => {
  const response = await request.put<Response>("/api/updateTask", updateData)
  return response.data;
};

export const getTask = async (taskID: string) => {
  const response = await request.get(`/api/getTask/${taskID}`);
  return response.data;
};
