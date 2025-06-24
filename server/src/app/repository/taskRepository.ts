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

    async createTask(data: any) {
  try {
    // Step 1: Fetch all students for each class in `data.classrooms`
    const classes = data.classrooms as string[];
    let studentsToConnect: { id: string }[] = [];

    if (classes && classes.length > 0) {
      const studentsOfClasses = await prisma.student.findMany({
        where: { class: { in: classes } },
        select: { id: true } // just get id
      });
      studentsToConnect = studentsOfClasses.map((s) => ({ id: s.id }));
    }

    // Step 2: Create the task with connected students
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        subject: data.subject,
        assignedDate: data.assignedDate,
        dueDate: data.dueDate,
        text: data.text,
        maxMarks: data.maxMarks,
        attachments: data.attachments,
        images: data.images,
        teacherId: data.teacherId,
        classrooms: data.classrooms,
        students: {
          connect: studentsToConnect,
        }
      }
    });

    return task;
  } catch (error) {
    console.log(
      "Error occurred while adding task in repository",
      error
    );
    return null;
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
        console.log("DELETE",id);
        
        if(!foundTask){
            return null
        }
          const submissions = await prisma.taskSubmission.findMany({
  where: { taskId: id },
  select: { attachments: true, images: true }
})

// 3️⃣ Gather all file URLs from submissions
const submissionFiles: string[] = submissions.flatMap((submission) => {
  const attachments = Array.isArray(submission.attachments) ? submission.attachments : []
  const images = Array.isArray(submission.images) ? submission.images : []
  return [
    ...attachments.map((file: any) => file.url || file),
    ...images.map((file: any) => file.url || file),
  ]
}).filter((url): url is string => typeof url === "string")

// 4️⃣ Delete all submission files from Cloudinary
for (const fileUrl of submissionFiles) {
  try {
    await deleteImageFromCloudinary(fileUrl)
  } catch (error) {
    console.error(`Error deleting file from Cloudinary: ${fileUrl}`, error)
  }
}

// 5️⃣ Delete all submission
await prisma.taskSubmission.deleteMany({ where: { taskId: id } })
    
    await prisma.task.update({
      where: { id },
      data: {
        students: { set: [] } 
      }
    })
    
        console.log("DAS",foundTask);
        
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
