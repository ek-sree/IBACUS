import { z } from "zod";

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};



export const taskAnswerSchema = z.object({
  text: z.string().min(1, "Text is required"),
  taskId: z.string().min(1, "Task ID is required"),
  studentId: z.string().min(1, "Student ID is required"),
  teacherId: z.string().min(1, "Teacher ID is required"),
  marks: z.number().min(0, "Marks must be a number"), 
});

export type TaskAnswerData = z.infer<typeof taskAnswerSchema>;
