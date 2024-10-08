import TaskCard from "../TaskCard/TaskCard";
import { TaskServer } from "../../pages/Home/homeType";
import { useCallback } from "react";

interface TasksProps {
  taskList: TaskServer[];
  currentPage: number;
}

export default function Tasks({ taskList, currentPage }: TasksProps) {
  const renderTasks = useCallback(
    (taskList: TaskServer[]) =>
      taskList.map((item: TaskServer, index: number) => {
        return (
          <TaskCard
            key={item.TASK_ID}
            task={{
              taskID: item.TASK_ID,
              taskName: item.NAME,
              note: item.NOTE,
              dueDate: item.DUEDATE,
              isComplete: item.ISCOMPLETE === 0 ? false : true,
            }}
            indexItem={index}
            currentPage={currentPage}
          />
        );
      }),
    [currentPage],
  );

  return (
    <div className="mt-3 px-6 py-3 bg-white rounded-lg">
      {taskList.length > 0 ? (
        renderTasks(taskList)
      ) : (
        <div className="text-start">No Task</div>
      )}
    </div>
  );
}
