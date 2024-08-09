import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons/faTrashCan";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask, updateState } from "../TaskCard/taskCardAPI";
import { useState } from "react";
import { TaskServer } from "../../pages/Home/homeType";
import { TaskCardProps, Delete, UpdateState, Action } from "./taskCardType";
import { getTask } from "../../pages/SaveTask/saveAPI";

export default function TaskCard({
  task, 
  currentPage,
}: TaskCardProps) {
  const navigation = useNavigate();
  const queryClient = useQueryClient();
  const [isWatching, setIsWatching] = useState(false);
  const actionTypes = ["delete", "updateState"];

  const mutationFn = async (action: Action) => {
    if (action.type === actionTypes[0]) {
      const response = await deleteTask(action.data as Delete);
      return response;
    } else {
      const response = await updateState(action.data as UpdateState);
      return response;
    }
  };

  const mutation = useMutation({
    mutationFn: mutationFn,
    onMutate: (action) => {
      queryClient.cancelQueries({
        queryKey: ["getTasks", currentPage],
        exact: true,
      });
      const previousData = queryClient.getQueryData([
        "getTasks",
        currentPage, 
      ]);

      queryClient.setQueryData(
        ["getTasks", currentPage,  ],
        action.type === actionTypes[0]
          ? (old: { data: TaskServer[] }) => {
              const list = old.data.filter(
                (item) => item.TASK_ID !== task.taskID,
              );
              return { ...old, data: list };
            }
          : (old: { data: TaskServer[] }) => {
              const list = old.data.map((item) => {
                if (item.TASK_ID === task.taskID)
                  return { ...item, ISCOMPLETE: !item.ISCOMPLETE ? 1 : 0 };
                return item;
              });
              return { ...old, data: list };
            },
      );

      return { previousData };
    },
    onError: (err, _, context) => {
      console.log(err, _, context);
      queryClient.setQueryData(
        ["getTasks", currentPage],
        context && context.previousData,
      );
    },
  });

  const handleUpdateState = () => {
    const action = {
      type: actionTypes[1],
      data: {
        taskID: task.taskID,
        isComplete: task.isComplete ? 0 : 1,
      },
    };

    mutation.mutate(action);
  };

  const handleWatch = () => {
    setIsWatching(!isWatching);
  };

  const handleHoverUpdate = () => {
    queryClient.prefetchQuery({
      queryKey: ["getTask", task.taskID],
      queryFn: () => getTask(task.taskID || 0),
    }) 
  }

  const handleUpdate = () => { 
    navigation("/update/" + task.taskID);
  };


  const handleDelete = () => {
    const action = {
      type: actionTypes[0],
      data: {
        taskID: task.taskID,
      },
    };
    mutation.mutate(action);
  };

  if (mutation.isError) return <div>{mutation.error?.message}</div>;

  return (
    <div className="p-2 my-2 border-2 bg-gray-200 rounded-lg">
      <div className="flex justify-between  sm:flex-col md:flex-row">
        <div className="flex col-span-7 md:col-span-9">
          <label
            className={`w-5 h-5 rounded-full ${task.isComplete ? `checkboxSuccess` : `checkboxPrimary`} flex-shrink-0`}
          />
          <input
            type="checkbox"
            className="w-5 h-5 rounded-lg opacity-0 -ml-5  flex-shrink-0"
            checked={task.isComplete}
            onChange={() => handleUpdateState()}
          />
          <div className="ml-2">
            <div className="rounded-lg w-20 md:w-80 text-blue-900">
              <span className="block break-words font-bold">
                {task.taskName}
              </span>
            </div>
            {isWatching ? (
              task.note ? (
                <div className="mt-2 px-2 py-1 bg-slate-300 rounded-lg w-20 md:w-80 text-blue-900">
                  <span className="block break-words ">
                    {task.note && task.note}
                  </span>
                </div>
              ) : (
                <div>
                  <span> No note </span>
                </div>
              )
            ) : null}
          </div>
        </div>
        <div className="flex col-span-7 md:col-span-9 justify-end items-start ">
          {task.dueDate && (
            <span className="px-2 rounded-lg border-2 border-red-400 mr-2 text-red-400">
              {task.dueDate.toString()}
            </span>
          )}

          <button className="mr-2" onClick={() => handleWatch()}>
            <FontAwesomeIcon icon={faEye} />
          </button>
          {task.isComplete ? null : (
            <button className="mr-2" onClick={() => handleUpdate()} onMouseEnter={() => handleHoverUpdate()}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
          )}
          <button onClick={() => handleDelete()}>
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      </div>
    </div>
  );
}
