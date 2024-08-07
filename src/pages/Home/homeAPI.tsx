import request from "../../utils/request";

export const handleFetchTasks = async () => {
    const { data } = await request.get("/api/getTasks");
    return data;
};    