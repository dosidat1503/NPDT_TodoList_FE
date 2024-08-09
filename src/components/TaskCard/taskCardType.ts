interface TaskInfoCard {
  taskID: number;
  taskName: string;
  note?: string;
  dueDate?: Date | string;
  isComplete: boolean;
}

interface TaskCardProps {
  task: TaskInfoCard;
  indexItem: number; 
  currentPage: number;
}

interface Delete {
  taskID: number;
}

interface UpdateState {
  taskID: number;
  isComplete: number;
}

interface Action {
  type: string;
  data: Delete | UpdateState;
}

export type { TaskInfoCard, TaskCardProps, Delete, UpdateState, Action };