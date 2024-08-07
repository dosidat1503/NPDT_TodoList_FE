 
import TaskCard from "../../components/TaskCard/TaskCard";
import { TaskInfoCard } from "../../components/TaskCard/TaskCard";
import { useQuery } from "@tanstack/react-query";
import request from "../../utils/request";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import paths from "../../routes/path"; 

export interface TaskServer {
  TASK_ID: number;
  NAME: string;
  NOTE: string;
  DUEDATE: string;
  ISCOMPLETE: number;
}

export default function Home() {  
  const handleFetchTasks = async () => {
    const { data } = await request.get("/api/getTasks");
    return data;
  };
 
  const { data, error, isLoading } = useQuery({
    queryKey: ["getTasks"],
    queryFn: handleFetchTasks,
  });

  const uncompleteTasks = data?.filter((item: TaskServer) => item.ISCOMPLETE === 0);
  const completeTasks = data?.filter((item: TaskServer) => item.ISCOMPLETE === 1);
   
  const renderTasks =   ( taskList: TaskInfoCard[]) =>
      taskList.map((item: any, index: number) => {
        return <TaskCard
          key={index}
          task={{
            taskID: item.TASK_ID,
            taskName: item.NAME,
            note: item.NOTE,
            dueDate: item.DUEDATE,
            isComplete: item.ISCOMPLETE === 0 ? false : true
          }}
          indexItem={index} 
          tasks={taskList}
        />;
      });

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

      {isLoading ? (
        <p className="mt-5">Loading...</p>
      ) : error ? (
        <p className="mt-5">Error</p>
      ) : (
        <div className="mt-5">
          <div className="mt-5">
            <span className="badge bg-white">Uncomplete</span>

            <div className="mt-3 px-6 py-3 bg-white rounded-lg">
              { uncompleteTasks.length > 0 ? renderTasks(uncompleteTasks)
               : (
                <div className="text-start">No Task</div>
              )}
            </div>
          </div>

          <div className="mt-5">
            <span className="badge bg-white">Complete</span>

            <div className="mt-3 px-6 py-3 bg-white rounded-lg">
              { completeTasks.length > 0 ? renderTasks(completeTasks)
               : (
                <div className="text-start">No Task</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
