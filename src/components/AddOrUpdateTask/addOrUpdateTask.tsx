import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns'; 
import request from "../../utils/request";
import { useMutation, useQueryClient } from "@tanstack/react-query"; 
import useGlobalContext from "../../context/globalVariables"; 
import { Riple } from 'react-loading-indicators';
 
const addTask = async (taskInfoAddOrUpdate: any): Promise<{ message: string }> => {
    const response = await request.post('/api/saveTask', taskInfoAddOrUpdate);
    return response.data;
};

const updateTask = async (taskInfoAddOrUpdate: any): Promise<{ message: string }> => {
    const response = await request.put('/api/updateTask', taskInfoAddOrUpdate);
    return response.data
} 
 
export default function AddOrUpdateTask() { 
    const { 
        taskInfoAddOrUpdate, setTaskInfoAddOrUpdate, 
        isShowAddOrUpdateTask, setIsShowAddOrUpdateTask, 
    } = useGlobalContext();
    const [message, setMessage] = useState<string>('');
    const [saveResponse, setSaveResponse] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const feilds = [
        {
            label: 'Task Name', 
            placeholder: 'Enter Task Name'
        },
        {
            label: 'Note', 
            placeholder: 'Enter Note'
        }
    ]  
 
    const mutationAdd = useMutation({
        mutationFn: addTask, 
        onSuccess: (data) => { 
            setSaveResponse(data.message);
            setTimeout(() => {
                setIsShowAddOrUpdateTask(!isShowAddOrUpdateTask);
                setTaskInfoAddOrUpdate({})
            }, 1000);
            
            queryClient.invalidateQueries({ exact: true })
            setIsSaving(false);
        },
        onError: () => {
            setSaveResponse("Save failed"); 
            setTimeout(() => {
                setSaveResponse("");
            }, 1000);
            setIsSaving(false);
        }, 
    });

    const mutationUpdate = useMutation({
        mutationFn: updateTask, 
        onSuccess: (data) => {
            setSaveResponse(data.message);
            setTimeout(() => {
                setIsShowAddOrUpdateTask(!isShowAddOrUpdateTask);
            }, 1000);
            queryClient.invalidateQueries({ exact: true })
            setIsSaving(false);
        },
        onError: () => {
            setSaveResponse("Save failed"); 
            setTimeout(() => {
                setSaveResponse("");
            }, 1000);
            setIsSaving(false);
        }, 
    }); 

    // Add and Update Task
    const handleSaveTask = useCallback(() => {
        setIsSaving(true);
        if(taskInfoAddOrUpdate.taskID === 0) {

            if(taskInfoAddOrUpdate.taskName === '') {
                setMessage('Task Name is required');
                return;
            }

            const saveData = {
                taskName: taskInfoAddOrUpdate.taskName,
                note: taskInfoAddOrUpdate.note,
                dueDate: format(taskInfoAddOrUpdate.dueDate, 'HH:mm dd/MM/yyyy'),
                isChangeDate: taskInfoAddOrUpdate.isChangeDate
            }; 
            mutationAdd.mutate(saveData);
        }
        else {
            
            const updateData = {
                taskID: taskInfoAddOrUpdate.taskID,
                taskName: taskInfoAddOrUpdate.taskName,
                note: taskInfoAddOrUpdate.note,
                dueDate: taskInfoAddOrUpdate.dueDate && format(taskInfoAddOrUpdate.dueDate, 'HH:mm dd/MM/yyyy'),
                isChangeDate: taskInfoAddOrUpdate.isChangeDate
            }; 
            mutationUpdate.mutate(updateData);
        } 
    }, [taskInfoAddOrUpdate]);
  
    const handleTurnBack = useCallback(() => {
        setIsShowAddOrUpdateTask(!isShowAddOrUpdateTask);
        setTaskInfoAddOrUpdate({
            taskID: 0,
            taskName: '',
            note: '',
            dueDate: new Date()
        })
    }, [isShowAddOrUpdateTask])
 
 
    const renderFeilds = feilds.map((item, index) => {
        return (
            <div className="flex flex-col mb-3" key={index}>
                <label className="ml-2">{item.label}</label>
                {
                    item.label === feilds[0].label
                    ? <div>
                        <input 
                            type="text" 
                            className="w-100% input" 
                            value={taskInfoAddOrUpdate.taskName}
                            placeholder={item.placeholder} 
                            onChange={ (e) => setTaskInfoAddOrUpdate({...taskInfoAddOrUpdate, taskName: e.target.value}) }
                        />
                        <p className="text-red-500 text-sm ml-2">{message}</p>
                    </div>
                    : <textarea 
                        className="w-100% h-32 input" 
                        value={taskInfoAddOrUpdate.note}
                        placeholder="Enter Note"
                        onChange={ (e) => setTaskInfoAddOrUpdate({...taskInfoAddOrUpdate, note: e.target.value}) }
                    />
                }
            </div>
        )
    })
 
    return (
        <div className=" h-97">
            <p className="font-bold text-2xl text-start">
                { taskInfoAddOrUpdate.taskID === 0 ? 'ADD TASK' : 'UPDATE TASK' } 
            </p>
            {
                saveResponse !== ''
                ? <div className="mt-2">
                    <span>{saveResponse}</span> 
                </div>
                : <div className="mt-2 flex items-start">
                    <button onClick={() => handleTurnBack()}  >
                        <FontAwesomeIcon icon={faCircleChevronLeft} className="text-2xl text-green-700" />
                    </button> 

                    <div className="flex flex-col col-span-4 sm:w-70 md:w-96 pl-4">
                        { renderFeilds}

                        {/* due date */} 
                        <div className="flex flex-col">
                            <label className="ml-2">Due Date</label>
                            <DatePicker
                                selected={taskInfoAddOrUpdate.dueDate}
                                onChange={(date) => {
                                    setTaskInfoAddOrUpdate({
                                        ...taskInfoAddOrUpdate, 
                                        dueDate: date || new Date(), 
                                        isChangeDate: true
                                    }) 
                                }}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={5}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="time"
                                className="w-100% border-2 rounded-lg px-3 py-1"
                            />
                        </div>

                        {
                            isSaving
                            ? <div className="flex justify-center mt-2">
                                <Riple color="#309fff" size="small" text="" textColor="" style={{ width: "10px" }}/>
                            </div>
                            : <div className="flex justify-end">
                                <button 
                                    className="bg-blue-950 text-white rounded-lg px-3 py-1 mt-4 flex items-center"
                                    onClick={() => handleSaveTask()}
                                >
                                    Save  
                                    <FontAwesomeIcon icon={faFloppyDisk} className="text-l text-white ml-2 my-1" />
                                </button>
                            </div>
                        }
                    </div> 
                </div>
            } 
        </div>
    )
}