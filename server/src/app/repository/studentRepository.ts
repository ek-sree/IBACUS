import { prisma } from "../../config/prisma.js";

   interface FindTasksOptions {
  studentId: string;
  searchTerm?: string;
  sortBy?: string;
  page?: number;
  itemsPerPage?: number;
  status?: "pending" | "completed";
}
export class StudentRepository {
    constructor() {}



async findTasksByStudent(
  studentId: string,
  searchTerm = "",
  sortBy = "",
  page = 1,
  itemsPerPage = 10,
  status: string
) {
  try {
    const now = new Date();

    const dueSoonDate = new Date();
  dueSoonDate.setDate(now.getDate() + 3);

   const totalTaskCount = await prisma.task.count({
    where: { students: { some: { id: studentId } } }
  });

  
  const completedCount = await prisma.task.count({
    where: {
      students: { some: { id: studentId } },
      TaskSubmission: { some: { studentId, status: true } }
    }
  });

   const pendingCount = await prisma.task.count({
    where: {
      students: { some: { id: studentId } },
      NOT: {
        TaskSubmission: { some: { studentId, status: true } }
      }
    }
  });

  const dueSoonCount = await prisma.task.count({
    where: {
      students: { some: { id: studentId } },
      dueDate: { lte: dueSoonDate }, // dueDate <= 3 days from now
      NOT: {
        TaskSubmission: { some: { studentId, status: true } }
      }
    }
  });

    // Validate numeric inputs
    const validatedPage = isNaN(Number(page)) ? 1 : Number(page);
    const validatedItemsPerPage = isNaN(Number(itemsPerPage)) ? 10 : Number(itemsPerPage);
console.log("S",status);

    const where: any = {
      students: { some: { id: studentId } }
    };


    if(searchTerm){
        where.OR=[{title:{contains:searchTerm}},{subject:{contains:searchTerm}}]
    }

    // Status filter
    if (status === "pending") {
      where.NOT = {
        TaskSubmission: {
          some: {
            AND: [
              { studentId },
              { status: true }
            ]
          }
        }
      };
    } else if (status === "completed") {
      where.TaskSubmission = {
        some: {
          AND: [
            { studentId },
            { status: true }
          ]
        }
      };
    }

    // Sorting
    const orderBy: any[] = [];
    if (sortBy) {
      if (sortBy === "assignedDateAsc") orderBy.push({ assignedDate: "asc" });
      if (sortBy === "assignedDateDesc") orderBy.push({ assignedDate: "desc" });
      if (sortBy === "dueDateAsc") orderBy.push({ dueDate: "asc" });
      if (sortBy === "dueDateDesc") orderBy.push({ dueDate: "desc" });
    }

    // Pagination
    const skip = (validatedPage - 1) * validatedItemsPerPage;
    const take = validatedItemsPerPage;

    // Fetch tasks
    const tasks = await prisma.task.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        TaskSubmission: { 
          where: { studentId },
          select: {
            id: true,
            status: true,
            createdAt: true,
            // include other fields you need
          }
        }
      }
    });

    const totalCount = await prisma.task.count({ where });

    return {
      tasks,
      totalCount,
      totalTaskCount, completedCount, pendingCount, dueSoonCount
    };
  } catch (error) {
    console.error("Error in findTasksByStudent:", error);
    return null;
  }
}

    async AddTaskAnswer(data: any) {
        try {
            const result = await prisma.taskSubmission.create({
                data:{
                    ...data,
                    status:true,
                }
            })
            return result || null;
        } catch (error) {
            console.log("Error in adding task answer");
            return null;
        }
    }


    async getStudentDashboard(studentId:string){
      try {
        const totalTask = await prisma.task.count({where:{students:{some:{id:studentId}}}})
        console.log("Taoal",totalTask);
        const completedTask = await prisma.taskSubmission.count({where:{studentId,status:true}})
        const pendingCount = totalTask-completedTask;
    const totalGrade = await prisma.taskSubmission.groupBy({
      by: ['studentId'],
      where: {
        studentId,
        marks: { gte: 0 },
      },
      _sum: { grade: true },
    });
    console.log("DAR",totalGrade);

    const taskDetails = await prisma.taskSubmission.findMany({
      where:{studentId},
      orderBy: {
    task: {
      createdAt: 'desc', 
    },
  },
      select:{
        grade:true,
        status:true,
        createdAt:true,
        task:{
          select:{
            title:true,
            createdAt:true,
          },
        },
      }
    })

    const now = new Date();
const day = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
const diffToMonday = (day === 0 ? 6 : day - 1); // diff so Monday is start
const startOfWeek = new Date(now.setHours(0, 0, 0, 0));
startOfWeek.setDate(now.getDate() - diffToMonday);

const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(startOfWeek.getDate() + 7);

// 🔵 Get current week's tasks count assigned to student
const currentWeekTaskCount = await prisma.task.count({
  where: {
    createdAt: {
      gte: startOfWeek,
      lt: endOfWeek,
    },
    students: { some: { id: studentId } },
  },
  take: 5,
});

// 🟠 Get sum of grades for submissions this week
const gradesThisWeek = await prisma.taskSubmission.aggregate({
  _sum: { grade: true },
  where: {
    studentId,
    status: true,
    createdAt: {
      gte: startOfWeek,
      lt: endOfWeek,
    },
  },
});

console.log("LOGGINF",gradesThisWeek);


const totalGradeThisWeek = gradesThisWeek._sum.grade || 0;
return{
  totalTask,
  completedTask,
  pendingCount,
  totalGrade:totalGrade[0]?totalGrade[0]._sum.grade:null,
  taskDetails,
  currentWeekTaskCount,
  totalGradeThisWeek,
}
    
      } catch (error) {
        console.log("Error occured while fetching dashboard details in student repository",error)
        return null;
      }
    }
}