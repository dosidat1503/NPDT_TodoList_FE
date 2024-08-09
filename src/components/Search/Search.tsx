import { RefObject, useEffect, useState } from "react";
import useDebounce from "./useDebounce";
import { useQuery } from "@tanstack/react-query";
import request from "../../utils/request";
import { useNavigate } from "react-router-dom";
import { TaskServer } from "../../pages/Home/homeType";

const searchTask = async (search: string) => {
  const response = await request.get(`/api/searchTask?query=${search}`);
  return response.data;
};

export default function Search({ scrollRef }: { scrollRef: RefObject<HTMLDivElement> }) {
  const [search, setSearch] = useState("");
  const navigation = useNavigate();

  const debouncedSearch = useDebounce(search, 300);

  const { data, error } = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: () => searchTask(debouncedSearch),
    enabled: debouncedSearch !== "",
  });

  useEffect(() => {
    const handleScroll = () => {
      setSearch("");
    };

    const divElement = scrollRef.current;
    if (divElement) {
      divElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (divElement) {
        divElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollRef]);

  if (error) return <p>Error</p>; 

  const renderResults = data?.map((task: TaskServer) => (
    <div
      key={task.TASK_ID}
      className="border-b border-gray-300 p-2 hover:bg-gray-300 rounded-lg m-2"
      onMouseDown={() => {
        navigation(`/update/${task.TASK_ID}`);
      }}
    > 
      <h3>{task.NAME}</h3>
    </div>
  ));

  return (
    <div className="ml-2 mt-2 rounded-lg w-1/2 relative">
      <input
        className="w-full input"
        placeholder="Search tasks"
        onChange={(e) => setSearch(e.target.value)}
        onBlur={() => setSearch("")}
      />
      <div className="mt-2 rounded-lg absolute max-h-96  bg-white w-full overflow-y-auto">
        {renderResults}
        {data?.length === 0 && <p className="p-2">No results</p>}
      </div>
    </div>
  );
}
