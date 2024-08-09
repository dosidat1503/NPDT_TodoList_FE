interface TaskServer {
  TASK_ID: number;
  NAME: string;
  NOTE: string;
  DUEDATE: string;
  ISCOMPLETE: number;
  created_at: string;
  updated_at: string;
}

interface PaginatedTasks {
  data: TaskServer[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  from: number | null;
  to: number | null;
}

interface ReturnData {
  data: TaskServer[];
  total: number;
  per_page: number;
}

export type { TaskServer, PaginatedTasks, ReturnData };