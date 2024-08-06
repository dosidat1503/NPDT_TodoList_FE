import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons/faTrashCan";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import TasksSlice from "../../pages/Home/TasksSlice";
import { deleteTask, updateState } from "../TaskCard/taskCardAPI";
import { RootState } from "../../redux/store";

export interface TaskInfoCard {
  taskID: number;
  taskName: string;
  note?: string;
  dueDate?: string;
  isComplete: boolean;
  isWatching: boolean;
}

interface TaskCardProps {
  task: TaskInfoCard;
  indexItem: number;
}

export default function TaskCard({ task, indexItem }: TaskCardProps) {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const tasks = useSelector((state: RootState) => state.tasks);
  const queryClient = useQueryClient();

  const mutationUpdateStateTask = useMutation({
    mutationFn: updateState,
    onError: (_) => {
      queryClient.invalidateQueries({ queryKey: ["getTasks"], exact: true }); 
    },
  });

  const { mutate: mutateDelete, error: errorDelete } = useMutation({
    mutationFn: deleteTask,
    onError: (_) => { 
      queryClient.invalidateQueries({ queryKey: ["getTasks"], exact: true });
    },
  });

  const handleUpdateState = useCallback(() => {
    const newTasks = [...tasks.tasks]; 
    dispatch(TasksSlice.actions.updateState(task.taskID));

    const updateStateData = {
      taskID: task.taskID,
      isComplete: newTasks[indexItem].isComplete ? 0 : 1,
    };

    mutationUpdateStateTask.mutate(updateStateData);
  }, [tasks]);

  const handleWatch = useCallback(() => {
    dispatch(TasksSlice.actions.watch(task.taskID));
  }, [tasks]);

  const handleUpdate = useCallback(() => {
    navigation("/update/" + task.taskID);
  }, [tasks]);

  const handleDelete = useCallback(() => {
    dispatch(TasksSlice.actions.delete(indexItem));

    const deleteData = {
      taskID: task.taskID,
    }; 
    mutateDelete(deleteData);
  }, [tasks]);

  return errorDelete ? (
    <div>{errorDelete?.message}</div>
  ) : mutationUpdateStateTask.error ? (
    <div>{mutationUpdateStateTask.error?.message}</div>
  ) : (
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
            {task.isWatching ? (
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
          {task.dueDate ? (
            <span className="px-2 rounded-lg border-2 border-red-400 mr-2 text-red-400">
              {task.dueDate.toString()}
            </span>
          ) : (
            <></>
          )}

          <button className="mr-2" onClick={() => handleWatch()}>
            <FontAwesomeIcon icon={faEye} />
          </button>
          {task.isComplete ? null : (
            <button className="mr-2" onClick={() => handleUpdate()}>
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
