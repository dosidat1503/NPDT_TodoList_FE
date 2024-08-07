import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Riple } from "react-loading-indicators";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { addTask, updateTask, getTask } from "./addOrUpdateTaskAPI";
import { useForm, Controller } from "react-hook-form";

export interface TaskInfoAddOrUpdate {
  taskID: number;
  taskName: string;
  note: string;
  dueDate: Date | string;
  isChangeDate: boolean;
}

export default function AddOrUpdateTask() {
  const navigation = useNavigate();
  const queryClient = useQueryClient();
  const { taskID } = useParams();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<TaskInfoAddOrUpdate>({
    defaultValues: {
      taskID: 0,
      taskName: "",
      note: "",
      dueDate: new Date(),
      isChangeDate: false,
    },
  });

  const mutationSave = useMutation({
    mutationFn: taskID ? updateTask : addTask,
    onSuccess: (_) => {
      navigation("/");
      queryClient.invalidateQueries({ queryKey: ["getTasks"], exact: true });
    },
    onError: () => {
      mutationSave.reset();
    },
  });

  const {
    data,
    error: erorDataUpdate,
    isLoading: isLoadingDataUpdate,
  } = useQuery({
    queryKey: ["getTask", taskID],
    queryFn: () => getTask(taskID || "0"),
  });

  const handleTurnBack = () => {
    navigation("/");
  };

  useEffect(() => {
    if (data && data.TASK_ID) {
      const parsedDate =
        data.DUEDATE && parse(data.DUEDATE, "HH:mm dd/MM/yyyy", new Date());
      setValue("taskID", data.TASK_ID);
      setValue("taskName", data.NAME);
      setValue("note", data.NOTE);
      setValue("dueDate", parsedDate);
      setValue("isChangeDate", false);
    }
  }, [data]);

  const onSubmit = (data: TaskInfoAddOrUpdate) => {
    mutationSave.mutate(data);
  };

  if (mutationSave.isError) {
    return (
      <div className="mt-2">
        <span className="text-red-600 font-bold">Save Failed</span>
      </div>
    );
  }
  if (mutationSave.isSuccess) {
    return (
      <div className="mt-2">
        <span className="text-green-400 font-bold">Save Successfully</span>
      </div>
    );
  }
  if (isLoadingDataUpdate && taskID) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    );
  }
  if (erorDataUpdate) {
    return (
      <div>
        <span>Error</span>
      </div>
    );
  }

  return (
    <div>
      <p className="font-bold text-2xl text-start">
        {taskID ? "UPDATE TASK" : "ADD TASK"}
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-2 flex items-start">
          <button onClick={() => handleTurnBack()}>
            <FontAwesomeIcon
              icon={faCircleChevronLeft}
              className="text-2xl text-green-700"
            />
          </button>

          <div className="flex flex-col col-span-4 sm:w-70 md:w-96 pl-4">
            <div className="flex flex-col mb-3">
              <label className="ml-2">Task Name</label>
              <div>
                <input
                  type="text"
                  className="w-100% input"
                  placeholder={"Enter Task Name"}
                  {...register("taskName", {
                    required: "Task name is required",
                    validate: (value) => {
                      if (value.trim() === "") {
                        return false;
                      }
                      return true;
                    },
                    minLength: {
                      value: 5,
                      message: "Task name must be at least 5 characters",
                    },
                    maxLength: {
                      value: 200,
                      message: "Task name must be at most 200 characters",
                    },
                  })}
                />
                <p className="text-red-500 text-sm ml-2">
                  {errors.taskName ? errors.taskName.message : ""}
                </p>
              </div>
            </div>

            <div className="flex flex-col mb-3">
              <label className="ml-2">Note</label>
              <textarea
                className="w-100% h-32 input"
                placeholder="Enter Note"
                {...register("note")}
              />
            </div>

            {/* due date */}
            <div className="flex flex-col">
              <label className="ml-2">Due Date</label>
              <Controller
                name="dueDate"
                control={control}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <DatePicker
                    selected={
                      typeof value === "string"
                        ? parse(value, "HH:mm dd/MM/yyyy", new Date())
                        : value
                    }
                    onChange={(date) => {
                      setValue("isChangeDate", true);
                      const parseDate =
                        date && format(date, "HH:mm dd/MM/yyyy");
                      onChange(parseDate);
                    }}
                    onBlur={onBlur}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={5}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    timeCaption="time"
                    className="w-100% border-2 rounded-lg px-3 py-1"
                    ref={ref}
                  />
                )}
              />
            </div>

            {mutationSave.isPending ? (
              <div className="flex justify-center mt-2">
                <Riple
                  color="#309fff"
                  size="small"
                  text=""
                  textColor=""
                  style={{ width: "10px" }}
                />
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  className="bg-blue-950 text-white rounded-lg px-3 py-1 mt-4 flex items-center"
                  type="submit"
                >
                  Save
                  <FontAwesomeIcon
                    icon={faFloppyDisk}
                    className="text-l text-white ml-2 my-1"
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
