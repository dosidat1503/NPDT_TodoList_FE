import request from "../../utils/request";
import { TaskInfoAddOrUpdate } from "./AddOrUpdateTask";

export interface Response {
  message: string;
}

export const saveTask = async (saveData: TaskInfoAddOrUpdate) => {
  const response =
    saveData.taskID === 0
      ? await request.post<Response>("/api/addTask", saveData)
      : await request.put<Response>("/api/updateTask", saveData);
  return response.data;
};

export const getTask = async (taskID: string) => {
  const response = await request.get(`/api/getTask/${taskID}`);
  return response.data;
};
