import { faEdit, faEye,  } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons/faTrashCan";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TaskInfoCard } from "../../context/globalVariables";
import useGlobalContext from "../../context/globalVariables";
import request from "../../utils/request";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { parse } from "date-fns"; 

interface TaskCardProps {
    task: TaskInfoCard;
    indexItem: number;  
}

const updateStateTask = async (stateUpdateInfo: any): Promise<{}> => { 
    const response = await request.put('/api/updateStateTask', stateUpdateInfo);
    return response.data
}

const deleteTask = async (deleteData: any): Promise<{}> => { 
    const response = await request.put('/api/deleteTask', deleteData);
    return response.data
} 

export default function TaskCard({ task, indexItem }: TaskCardProps) {
    const { 
        setTaskInfoAddOrUpdate, 
        tasks, setTasks, 
        setIsShowAddOrUpdateTask, 
        haveTaskInState, setHaveTaskInState,
        handleCheckHaveTaskInState
    } = useGlobalContext();
    // const queryClient = useQueryClient();
 
    const mutationUpdateStateTask = useMutation({
        mutationFn: updateStateTask, 
        onSuccess: () => {
            handleCheckHaveTaskInState();
        } 
    });

    const mutationDeleteTask = useMutation({
        mutationFn: deleteTask, 
        onSuccess: () => { 
            const taskQuantityComplete = tasks.filter((item: any) => item.isComplete).length;
            const taskQuantityUncomplete = tasks.filter((item: any) => !item.isComplete).length;
            if(taskQuantityComplete === 1) setHaveTaskInState({ ...haveTaskInState, complete: false, });
            if(taskQuantityUncomplete === 1) setHaveTaskInState({ ...haveTaskInState, uncomplete: false }); 
        }
    }); 

    const handleUpdateState = useCallback(() => {
        const newTasks = [...tasks];
        
        if(!newTasks[indexItem].isComplete) newTasks[indexItem].isComplete = true; 
        else newTasks[indexItem].isComplete = false; 

        setTasks(newTasks);

        const updateStateData = {
            taskID: task.taskID,
            isComplete: newTasks[indexItem].isComplete ? 1 : 0
        }

        mutationUpdateStateTask.mutate(updateStateData); 
    }, [tasks]);

    const handleWatch = useCallback(() => {
        const newTasks = tasks.map((item: any, indexTask) => {
            if(!item.isWatching && indexTask === indexItem ) return { ...item, isWatching: true }; 
            else return { ...item, isWatching: false }
        }); 

        setTasks(newTasks);
    }, [tasks]);

    const handleUpdate = useCallback(() => { 
        setIsShowAddOrUpdateTask(true); 
        const parsedDate = task.dueDate && parse(task.dueDate, 'HH:mm dd/MM/yyyy', new Date());

        setTaskInfoAddOrUpdate({
            taskID: task.taskID,
            taskName: task.taskName,
            note: task.note,
            dueDate:  parsedDate,
        }); 

    }, [tasks])

    const handleDelete = useCallback(() => {
        const newTasks = [...tasks];

        newTasks.splice(indexItem, 1);

        setTasks(newTasks);

        const deleteData = {
            taskID: task.taskID
        }
        mutationDeleteTask.mutate(deleteData);
    }, [tasks]); 
  
    return (
        <div className="p-2 my-2 border-2 bg-gray-200 rounded-lg">
            <div className="flex justify-between  sm:flex-col md:flex-row">
                <div className="flex col-span-7 md:col-span-9"> 
                    <label className={`w-5 h-5 rounded-full ${ task.isComplete ? `checkboxSuccess` : `checkboxPrimary` } flex-shrink-0`} /> 
                    <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded-lg opacity-0 -ml-5  flex-shrink-0" 
                        checked={task.isComplete}
                        onChange={ () => handleUpdateState() }
                    /> 
                    <div className="ml-2">
                        <div className="rounded-lg w-20 md:w-80 text-blue-900">
                            <span className="block break-words font-bold">
                                {task.taskName}
                            </span>
                        </div> 
                        {
                            task.isWatching 
                            ? task.note 
                                ? <div className="mt-2 px-2 py-1 bg-slate-300 rounded-lg w-20 md:w-80 text-blue-900">
                                    <span className="block break-words ">
                                        { task.note && task.note }
                                    </span>
                                </div>
                                : <div>
                                    <span> No note </span>
                                </div>
                            : null
                        }
                    </div>
                </div>
                <div className="flex col-span-7 md:col-span-9 justify-end items-start ">
                    {
                        task.dueDate 
                        ? <span className="px-2 rounded-lg border-2 border-red-400 mr-2 text-red-400">
                            { task.dueDate.toString() }
                        </span> 
                        : <></>
                    }
                     
                    <button className="mr-2" onClick={ () => handleWatch() }>
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                    {
                        task.isComplete
                        ? null
                        : <button className="mr-2" onClick={ () => handleUpdate() }>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                    }
                    <button onClick={ () => handleDelete() }>
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button> 
                </div>
            </div> 
        </div>
    )
}