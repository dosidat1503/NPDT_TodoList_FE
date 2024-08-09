import request from "../../utils/request";
import { Response } from "../../pages/SaveTask/saveAPI";

interface StateUpdateInfo {
  taskID: number;
  isComplete: number;
}

interface DeleteData {
  taskID: number;
}

export const updateState = async (stateUpdateInfo: StateUpdateInfo) => {
  const response = await request.put<Response>(
    "/api/updateStateTask",
    stateUpdateInfo,
  );
  return response.data;
};

export const deleteTask = async (deleteData: DeleteData) => {
  const response = await request.put<Response>("/api/deleteTask", deleteData);
  return response.data;
};
