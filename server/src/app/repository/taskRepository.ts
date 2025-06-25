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
    let classes: string[] = Array.isArray(data.classrooms) ? data.classrooms : [];
    let studentIds: string[] = Array.isArray(data.students) ? data.students : [];

    // Gather students of the classes
    let studentsToConnect: { id: string }[] = [];

    if (classes.length > 0) {
      const classStudents = await prisma.student.findMany({
        where: { class: { in: classes } },
        select: { id: true }
      });
      studentsToConnect.push(...classStudents.map((s) => ({ id: s.id })));
    }

    // Add explicit students too
    if (studentIds.length > 0) {
      studentsToConnect.push(...studentIds.map((id) => ({ id })));
    }

    // Remove duplicates
    studentsToConnect = Array.from(
      new Map(studentsToConnect.map((s) => [s.id, s])).values()
    );

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        subject: data.subject,
        assignedDate: data.assignedDate,
        dueDate: data.dueDate,
        text: data.text,
        maxMarks: data.maxMarks,
        attachments: data.attachments || [],
        images: data.images || [],
        teacherId: data.teacherId,
        classrooms: classes,
        students: { connect: studentsToConnect },
      },
    });

    return task;
  } catch (error) {
    console.error(
      "Error occurred while adding task in repository:",
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
