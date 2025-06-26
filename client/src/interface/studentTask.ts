export interface TaskSubmission{
  id:string;
  grade:number;
  createdAt:string;
}

export interface Task {
  id: string;
  TaskSubmission: TaskSubmission[];
  title: string;
  subject: string;
  maxMarks: number;
  assignedDate: string;
  dueDate: string;
  isCompleted: boolean;
  completedDate?: string;
  obtainedMarks?: number;
}

export interface CompletedTaskTableProps {
  tasks: Task[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  error:string | null;
  loading:boolean;
  totalCount:number;
}


export interface Task {
  id: string;
  title: string;
  subject: string;
  maxMarks: number;
  assignedDate: string;
  dueDate: string;
  isCompleted: boolean;
}

export interface NotCompletedTaskProps {
  tasks: Task[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  error:string | null;
  loading:boolean
  totalCount:number
}