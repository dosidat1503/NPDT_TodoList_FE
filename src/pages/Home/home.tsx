import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import paths from "../../routes/path";
import { handleFetchTasks } from "./homeAPI";
import Tasks from "./Tasks";

export interface TaskServer {
  TASK_ID: number;
  NAME: string;
  NOTE: string;
  DUEDATE: string;
  ISCOMPLETE: number;
}

export default function Home() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["getTasks"],
    queryFn: handleFetchTasks,
  });

  const uncompleteTasks: TaskServer[] = data?.filter(
    (item: TaskServer) => item.ISCOMPLETE === 0,
  );
  const completeTasks: TaskServer[] = data?.filter(
    (item: TaskServer) => item.ISCOMPLETE === 1,
  );

  if (isLoading) return <p className="mt-5">Loading...</p>;
  if (error) return <p className="mt-5">Error</p>;

  return (
    <div className=" overflow-y-auto rounded-lg">
      <div className="mt-5">
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
          <Tasks taskList={uncompleteTasks} />
        </div>

        <div className="mt-5">
          <span className="badge bg-white">Complete</span>
          <Tasks taskList={completeTasks} />
        </div>
      </div>
    </div>
  );
}
