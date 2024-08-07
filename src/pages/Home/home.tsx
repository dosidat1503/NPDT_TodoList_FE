import { useCallback, useEffect, useState } from "react";
import TaskCard from "../../components/TaskCard/TaskCard";
import { TaskInfoCard } from "../../components/TaskCard/TaskCard";
import { useQuery } from "@tanstack/react-query";
import request from "../../utils/request";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import paths from "../../routes/path";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import TasksSlice from "../Home/TasksSlice";

export interface TaskServer {
  TASK_ID: number;
  NAME: string;
  NOTE: string;
  DUEDATE: string;
  ISCOMPLETE: number;
}

interface HaveTaskInState {
  complete: boolean;
  uncomplete: boolean;
}

export default function Home() {
  const [haveTaskInState, setHaveTaskInState] = useState<HaveTaskInState>({
    complete: true,
    uncomplete: true,
  });
  const tasks = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch();

  const handleFetchTasks = async () => {
    const { data } = await request.get("/api/getTasks");
    return data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["getTasks"],
    queryFn: handleFetchTasks,
  });

  useEffect(() => {  
    let checkUpdate = false;
    const tasksList = tasks.tasks
    console.log(tasksList)
    if(data && tasksList.length > 0 && data.length === tasksList.length) {
      checkUpdate = data.some((item: TaskServer, index: number) =>  
        item.NAME !== tasksList[index].taskName 
        || item.NOTE !== tasksList[index].note 
        || item.DUEDATE !== tasksList[index].dueDate);
      console.log(checkUpdate)
    }
    if ((data && data.length !== tasks.tasks.length) || checkUpdate) {
      const tasksData = data.map((item: TaskServer) => {
        return {
          taskID: item.TASK_ID,
          taskName: item.NAME,  
          note: item.NOTE,
          dueDate: item.DUEDATE,
          isComplete: item.ISCOMPLETE === 0 ? false : true,
          isWatching: false,
        };
      });

      dispatch(TasksSlice.actions.setTasks(tasksData)); 
    }  
  }, [data]);

  useEffect(() => {
    const isHaveTaskInCompleteList = tasks.tasks.some(
      (item: TaskInfoCard) => item.isComplete,
    );
    const isHaveTaskInUncompleteList = tasks.tasks.some(
      (item: TaskInfoCard) => !item.isComplete,
    );

    setHaveTaskInState({
      complete: isHaveTaskInCompleteList,
      uncomplete: isHaveTaskInUncompleteList,
    });
  }, [tasks]);

  const renderTasks = useCallback(
    (isComplete: boolean) =>
      tasks.tasks.map((item: TaskInfoCard, index: number) => {
        if (item.isComplete === isComplete)
          return <TaskCard key={index} task={item} indexItem={index} />;
      }),
    [tasks],
  );

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
              {haveTaskInState.uncomplete ? (
                renderTasks(false)
              ) : (
                <div className="text-start">No Task</div>
              )}
            </div>
          </div>

          <div className="mt-5">
            <span className="badge bg-white">Complete</span>

            <div className="mt-3 px-6 py-3 bg-white rounded-lg">
              {haveTaskInState.complete ? (
                renderTasks(true)
              ) : (
                <div className="text-start">No Task</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
