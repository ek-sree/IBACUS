export interface GradeForSubmissionModalProps{
  isOpen:boolean;
  onClose:()=>void;
  submissionId:string;
  submissionDate:string|null;
  studentName:string|null;
  totalMark:number | undefined;
}

export interface GradeFormValues {
  gradeMarks: string;
}
