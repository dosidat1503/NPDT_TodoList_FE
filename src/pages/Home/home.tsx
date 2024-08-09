import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import paths from "../../routes/path";
import { handleFetchTasks } from "./homeAPI";
import Tasks from "../../components/Tasks/Tasks";
import Search from "../../components/Search/Search";
import { useRef, useState } from "react";
import { Pagination } from "antd";
import { TaskServer } from "./homeType";
 
export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); 
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["getTasks", currentPage],
    queryFn: () => handleFetchTasks(currentPage),   
  }); 
  const uncompleteTasks: TaskServer[] =
    data?.data.filter((item: TaskServer) => item.ISCOMPLETE === 0) ?? [];
  const completeTasks: TaskServer[] =
    data?.data.filter((item: TaskServer) => item.ISCOMPLETE === 1) ?? [];

  if (isLoading) return <p className="mt-5">Loading...</p>;
  if (error) return <p className="mt-5">Error</p>; 

  const handleHoverPage = (page: number) => {
    queryClient.prefetchQuery({
      queryKey: ["getTasks", page],
      queryFn: () => handleFetchTasks(page),
    }); 
  };
 
  return (
    <div ref={scrollRef} className="h-95% overflow-y-auto rounded-lg pb-2">
      <Search scrollRef={scrollRef} />
      <div className="pl-2 py-4 bg-bgMain rounded-b-lg ">
        <Link
          to={paths.add}
          className="btn bg-white text-blue-950 border-blue-950 border-2"
        >
          <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
          &nbsp;&nbsp; Add
        </Link>
      </div>
      <div className="mt-5">
        <div className="mt-5">
          <span className="badge bg-white">Uncomplete</span>
          <Tasks
            taskList={uncompleteTasks} 
            currentPage={currentPage}
          />
        </div>

        <div className="mt-5">
          <span className="badge bg-white">Complete</span>
          <Tasks
            taskList={completeTasks} 
            currentPage={currentPage}
          />
        </div>
      </div>
      <div className="mt-3">
        <Pagination
          current={currentPage}
          total={data?.total}
          pageSize={data?.per_page}
          onChange={(page: number) => setCurrentPage(page)}
          align="center" 
          itemRender={(page, type, originalElement) => {
            if (type === 'page') {
              return (
                <div
                  onMouseEnter={() => handleHoverPage(page)} 
                >
                  {originalElement}
                </div>
              );
            }
            return originalElement;
          }}
        />
      </div>
    </div>
  );
} 