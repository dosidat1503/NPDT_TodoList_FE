
import { useCallback, useEffect,  } from "react";
import Button from "../../components/Button/button";
import TaskCard from "../../components/TaskCard/taskcard";
import AddOrUpdateTask from "../../components/AddOrUpdateTask/addOrUpdateTask"; 
import useGlobalContext from "../../context/globalVariables"; 
import { useQuery } from "@tanstack/react-query";
import request from "../../utils/request";
 
export interface TaskServer {
    TASK_ID: number;
    NAME: string;
    NOTE: string; 
    DUEDATE: string;
    ISCOMPLETE: number;
}
 

export default function Home() {  
    const { 
        setTaskInfoAddOrUpdate, 
        tasks, setTasks, 
        isShowAddOrUpdateTask, setIsShowAddOrUpdateTask, 
        haveTaskInState, setHaveTaskInState, 
    } = useGlobalContext(); 

    const handleFetchTasks = async () => {
        const { data } = await request.get('/getTasks');
        return data;
    };
   
    const { data, error, isLoading } = useQuery({
        queryKey: ['getTasks'],
        queryFn: handleFetchTasks,
    });
  

    useEffect(() => {
        if (data) {
            const tasks = data.map((item: TaskServer) => {
                return {
                    taskID: item.TASK_ID,
                    taskName: item.NAME,
                    note: item.NOTE,
                    dueDate: item.DUEDATE,
                    isComplete: item.ISCOMPLETE === 0 ? false : true,
                    isWatching: false,
                };
            });
            const isHaveTaskInCompleteList = tasks.some((item: any) => item.isComplete); 
            const isHaveTaskInUncompleteList = tasks.some((item: any) => !item.isComplete); 
    
            setHaveTaskInState({ 
                complete: isHaveTaskInCompleteList, 
                uncomplete: isHaveTaskInUncompleteList 
            }); 
            setTasks(tasks);  
        } 
    }, [data]);
 
    

    const renderTasks = useCallback((isComplete: boolean) => {
        return tasks.map((item: any, index: number) => { 
            if(item.isComplete === isComplete) 
                return (
                    <TaskCard 
                        key={index} 
                        task={item} 
                        indexItem={index}   
                    />
                )
        })
    }, [tasks]);
 
    return (
        isShowAddOrUpdateTask
        ? <AddOrUpdateTask  />
        : <div className="h-97 overflow-y-auto rounded-lg">    
            <div className="mt-5">
                <Button 
                    name='Add Task' 
                    onClick={() => {
                        setIsShowAddOrUpdateTask(!isShowAddOrUpdateTask)
                        setTaskInfoAddOrUpdate({ 
                            taskID: 0,
                            taskName: '',
                            note: '',
                            dueDate: new Date(),
                            isChangeDate: false,
                        })
                    }} 
                    backgroundColor='bg-white'
                    textColor='text-bgSidebar'
                    borderColor="border-bgSidebar"
                /> 
            </div>

            {
                isLoading
                ? <p className="mt-5">Loading...</p>
                :   error
                    ? <p className="mt-5">Error</p>
                    : <div className="mt-5">
                        <div className="mt-5">
                            <span className="badge bg-white">
                                Uncomplete
                            </span>

                            <div className="mt-3 px-6 py-3 bg-white rounded-lg">
                                { 
                                    haveTaskInState.uncomplete 
                                    ? renderTasks(false)
                                    : <div className="text-start">No Task</div>
                                }
                            </div>
                        </div>

                        <div className="mt-5">
                            <span className="badge bg-white">
                                Complete
                            </span>

                            <div className="mt-3 px-6 py-3 bg-white rounded-lg">
                                { 
                                    haveTaskInState.complete 
                                    ? renderTasks(true)
                                    : <div className="text-start">No Task</div>
                                }
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}