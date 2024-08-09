import request from "../../utils/request";
import { PaginatedTasks, ReturnData } from "./homeType";

export const handleFetchTasks = async (
  currentPage: number,
): Promise<ReturnData> => {
  const { data } = await request.get<PaginatedTasks>("/api/getTasks", {
    params: { page: currentPage },
  });

  return { data: data.data, total: data.total, per_page: data.per_page };
};
