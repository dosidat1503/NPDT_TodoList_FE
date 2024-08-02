import { createContext, useCallback, useContext, useState } from "react";


export interface TaskInfoCard {
    taskID: number;
    taskName: string;
    note?: string;
    dueDate?: string;
    isComplete: boolean;
    isWatching: boolean;
}

interface TaskInfoAddOrUpdate {
    taskID: number;
    taskName: string;
    note: string;
    dueDate: Date;
    isChangeDate: boolean;
}

interface haveTaskInState {
    complete: boolean;
    uncomplete: boolean;
}
 
interface contextType {  
    isLoading: boolean,
    setIsLoading: (isLoading: boolean) => void,
    page: string,
    setPage: (page: string) => void,
    taskInfoAddOrUpdate: TaskInfoAddOrUpdate,
    setTaskInfoAddOrUpdate: (taskInfoAddOrUpdate: any) => void,
    tasks: TaskInfoCard[],
    setTasks: (tasks: TaskInfoCard[]) => void,
    isShowAddOrUpdateTask: boolean,
    setIsShowAddOrUpdateTask: (isShowAddOrUpdateTask: boolean) => void,
    haveTaskInState: haveTaskInState,
    setHaveTaskInState: (haveTaskInState: haveTaskInState) => void,
    handleCheckHaveTaskInState: () => void,
}

const GlobalContext = createContext<contextType >({  
    isLoading: false,
    setIsLoading: () => {},
    page: '',
    setPage: () => {},
    taskInfoAddOrUpdate: {
        taskID: 0,
        taskName: '',
        note: '',
        dueDate: new Date(),
        isChangeDate: false,
    },
    setTaskInfoAddOrUpdate: () => {},
    tasks: [],
    setTasks: () => {},
    isShowAddOrUpdateTask: false,
    setIsShowAddOrUpdateTask: () => {},
    haveTaskInState: {
        complete: true,
        uncomplete: true,
    },
    setHaveTaskInState: () => {},
    handleCheckHaveTaskInState: () => {},
});

export function GlobalProvider({children}: {children: React.ReactNode}) {  
    const [isLoading, setIsLoading] = useState<boolean>(true); 
    const [page, setPage] = useState<string>('TASK');
    const [taskInfoAddOrUpdate, setTaskInfoAddOrUpdate] = useState<TaskInfoAddOrUpdate>({
        taskID: 0,
        taskName: '',
        note: '',
        dueDate: new Date(),
        isChangeDate: false,
    })
    const [tasks, setTasks] = useState<TaskInfoCard[]>([]); 
    const [isShowAddOrUpdateTask, setIsShowAddOrUpdateTask] = useState<boolean>(false); 
    const [haveTaskInState, setHaveTaskInState] = useState<haveTaskInState>({
        complete: true,
        uncomplete: true,
    })

    const handleCheckHaveTaskInState = useCallback(() => {
        const isHaveTaskInCompleteList = tasks.some((item: any) => item.isComplete); 
        const isHaveTaskInUncompleteList = tasks.some((item: any) => !item.isComplete); 

        setHaveTaskInState({ 
            complete: isHaveTaskInCompleteList, 
            uncomplete: isHaveTaskInUncompleteList 
        }); 
    }, [tasks]);

    return (
        <GlobalContext.Provider value={{ 
            isLoading, setIsLoading,
            page, setPage,
            taskInfoAddOrUpdate, setTaskInfoAddOrUpdate,
            tasks, setTasks,
            isShowAddOrUpdateTask, setIsShowAddOrUpdateTask,
            haveTaskInState, setHaveTaskInState,
            handleCheckHaveTaskInState
        }}>
            {children}
        </GlobalContext.Provider>
    );
};
 
export default function useGlobalContext() {
    return useContext(GlobalContext);
}  