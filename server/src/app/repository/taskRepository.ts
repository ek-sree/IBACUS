import { prisma } from "../../config/prisma.js";
import { deleteImageFromCloudinary } from "../../service/cloudinary.js";

interface IGetTasks{
    page:number;
    limit:number;
    search?:string;
    sort?:string;
    teacherId?:string;
    classroom?:string;
    studentId?:string;
    taskId?:string;
}

export class TaskRepository {

    async createTask(data:any){
        try {
            const task = await prisma.task.create({data})

            if(!task){
                return null
            }
            return task;
        } catch (error) {
            console.log("Error occured while adding task in repository",error);
            return null
        }
    }

    async findAllTasks(data:IGetTasks) {
  try {
    
    const where: any = {};
    const orderBy: any[] = [];

    if (data.sort) {
  if (data.sort === "assignedDate_asc") {
    orderBy.push({ assignedDate: "asc" });
  } else if (data.sort === "assignedDate_desc") {
    orderBy.push({ assignedDate: "desc" });
  } else if (data.sort === "dueDate_asc") {
    orderBy.push({ dueDate: "asc" });
  } else if (data.sort === "dueDate_desc") {
    orderBy.push({ dueDate: "desc" });
  }
}

    if (data.teacherId) {
      where.teacherId = data.teacherId;
    }

    if (data.studentId) {
      where.students = {
        some: {
          id: data.studentId
        }
      };
    }

    if(data.search){
        where.OR=[{title:{contains:data.search}},{subject:{contains:data.search}}]
    }

    if (data.taskId) {
      where.id = data.taskId;
    }

    const skip = (data.page-1)* data.limit
    const take = data.limit;

    let tasks = await prisma.task.findMany({ where ,skip,take,orderBy});
     const totalCount = await prisma.task.count({where});

    if (data.classroom) {
      tasks = tasks.filter((task) => {
        const cls = Array.isArray(task.classrooms) ? task.classrooms : [];
        return cls.includes(data.classroom as string); 
      });
    }
    
if(!tasks || !totalCount){
    return null
}
    return {tasks,totalCount};
  } catch (error) {
    console.log(
      "Error occurred while finding all tasks in repository",
      error
    );
    return null;
  }
}



 async findTasksByClassroomAndStudent(studentId: string, classroom: string) {
  try {
    // Fetch all tasks assigned to the student or classroom
    const studentTasks = await prisma.task.findMany({
      where: { students: { some: { id: studentId } } },
      include: { TaskSubmission: { where: { studentId } } },
    });

    const allClassroomTasks = await prisma.task.findMany({
      include: { TaskSubmission: { where: { studentId } } },
    });

    const classroomTasks = allClassroomTasks.filter((task) => {
      const clsArray = Array.isArray(task.classrooms) ? task.classrooms : [];
      return clsArray.includes(classroom);
    });

    // Merge & remove duplicates
    const mergedTasks = [...studentTasks, ...classroomTasks];
    const uniqueTasks = Array.from(
      new Map(mergedTasks.map((task) => [task.id, task])).values()
    );

    // Split into pending & completed
    const pendingTasks = uniqueTasks.filter((task) => {
      const submission = task.TaskSubmission[0];
      return !submission || submission.status === false;
    });

    const completedTasks = uniqueTasks.filter((task) => {
      const submission = task.TaskSubmission[0];
      return submission && submission.status === true;
    });

    return { pendingTasks, completedTasks };
  } catch (error) {
    console.error(error);
    return null;
  }
}



async deleteTaskById(id:string){
    try {
        const foundTask = await prisma.task.findUnique({ where: { id } });
        if(!foundTask){
            return null
        }
        
          const attachments = (foundTask.attachments as any) || [];
    const images = (foundTask.images as any) || [];

     const allFiles: string[] = [
      ...attachments.map((file: any) => file.url || file), 
      ...images.map((file: any) => file.url || file)
    ];

     for (const fileUrl of allFiles) {
      try {
        await deleteImageFromCloudinary(fileUrl); 
      } catch (error) {
        console.error(`Error deleting file from Cloudinary: ${fileUrl}`, error);
      }
    }
        const deleteTask =  await prisma.task.delete({where:{id}})
        if(!deleteTask){
            return null
        }
        return deleteTask;
    } catch (error) {
        console.log("Error occured while deleting task",error);
        return null
        
    }
}
    
}
