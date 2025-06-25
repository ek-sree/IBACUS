import { prisma } from "../../config/prisma.js";
import { Role } from "../../generated/prisma/index.js";
import { StatusCode } from "../../interface/statusCode.js";

interface StudentsData{
    email:string,
    name:string,
    class:string,
}

interface DashboardData {
  studentCount: number;
  taskCount: number;
  totalSubmissions:number;
  averageGradePercentage: number;
  weeklySubmissions: number[];
  topStudents: { name: string; email: string; totalMarks: number }[];
}

export class TeacherRepository {

    async findAllStudents(teacherId?: string,page:number=1,limit:number=5,className?:string,search?:string) {
      const skip = (page -1) * limit;
      const where: any = {}

      if(className){
        where.class={contains:className}
      }

      if(search){
        where.OR=[{name:{contains:search}},{email:{contains:search}}]
      }

    if (teacherId) {
      const students = await prisma.student.findMany({
        where: { teacherId,...where },
        skip,
        take:limit,
        select: {
              id: true,
              name: true,
              email: true,
              class: true
        }
      });
      return students || [];
    } else {
      return await prisma.student.findMany({
        where,
      skip,
      take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          class: true
        }
      });
    }
  }

    
  async createStudent(data:StudentsData[],teacherId:string,role:string) {
   try {
     const studentsData = data.map((student)=>({
        name:student.name,
        email:student.email,
        class:student.class,
        role:role.toLowerCase() as Role,
        avatar: "",
        teacherId
    }))

    const result = await prisma.student.createMany({
        data:studentsData,
    })
    return result;
   } catch (error) {
    console.log("Error occured while creating student in teacher Repository", error)
   }
  }


    async countStudents(teacherId?: string,className?: string,search?: string): Promise<number | null> {
   try {
     const where: any = {};
    if (className) {
      where.class = { contains: className };
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (teacherId) {
      where.teacherId = teacherId;
    }

    return await prisma.student.count({ where }); 
   } catch (error) {
    console.log("ERROR occured while getting student count in repo");
    return null;
   }
  }

  async deleteStudent(id:string):Promise<StudentsData | null>{
    console.log("ID",typeof(id));
    console.log("ID is",id);
    
    try {
      const studentCheck = await prisma.student.findUnique({ where: { id } });
      if (!studentCheck) {
        return null;
      }
      return await prisma.student.delete({
        where:{
            id
        }
    })
    } catch (error) {
      console.log("Error occured while deleting student in repository",error);
      return null;
    }
  }

  async updateStudent(studentId:string,email:string,name:string,className:string):Promise<any>{
    try {
      return await prisma.student.update({
        where:{
            id:studentId
        }, data:{
            email,
            name,
            class:className
        }
    })
    } catch (error) {
      console.log("Error occured while updating student in repository",error);
      return null
    }
  }

  async findStudentAndClass(teacherId?:string){
    try {    
      let students:any;
       if (teacherId !== undefined && teacherId !== "undefined") {
        students = await prisma.student.findMany({ where: { teacherId } });
      }else{
         students = await prisma.student.findMany();
      }      
      const uniqueClass = Array.from(new Set(students.map((students:StudentsData)=>students.class)))
      const className = uniqueClass.map(c=>({value: String(c), label: String(c)}))
      
      return {students,className}
    } catch (error) {
      console.log("Error occured while finding student and class in repository",error);
      return null;
    }
  }

  async findStudentsByTaskId(taskId:string,page:number,limit:number,search?:string){
    try {
      const skip = (page-1)*limit;
      const taskWithStudent = await prisma.task.findUnique({where:{id:taskId},select:{students:true}})
      if(!taskWithStudent){
        return null;
      }
      const submissions = await prisma.taskSubmission.findMany({where:{taskId},select:{studentId:true,createdAt:true}})
      const submittedIds = Object.fromEntries(submissions.map((sub)=>[sub.studentId,sub.createdAt]))

       let filteredStudents = taskWithStudent.students;

    if (search && search.trim() !== "") {
      
      const lowerSearch = search.toLowerCase();
      filteredStudents = filteredStudents.filter(
        (student) =>
          student.name.toLowerCase().includes(lowerSearch) ||
          student.email.toLowerCase().includes(lowerSearch)
      );
    }
      const data = filteredStudents.map((student)=>({
        id:student.id,
        name:student.name,
        email:student.email,
        class:student.class,
        status:submittedIds[student.id] ? 'Submitted' : 'Pending',
        submissionDate:submittedIds[student.id] || null,
      })).slice(skip,skip+ Number(limit));

      if(!filteredStudents){
        return null;
      }
      return {data,totalCount: filteredStudents.length};

      
    } catch (error) {
      console.log("Error occured while finding students by task ID in repository",error);
      return null;
      
    }
  }

  async findSubmittedAnswer(taskId:string,studentId:string){
    try {
      const answer = await prisma.taskSubmission.findUnique({
  where: { taskId_studentId: { taskId, studentId } },
});

      return answer || null;
    } catch (error) {
      console.log("Error occured while finding submitted answers",error)
      return null;
    }
  }


  async addSubmissionGrade(id:string,grade:number){
    try {
      
      const updatedSubmission = await prisma.taskSubmission.update({
        where: { id },
        data: { grade },
      });
      
      return updatedSubmission || null;
    } catch (error) {
      console.log("Error occured while adding submission grade",error);
      return null;
    }
  }


  async findDashboardDetails(teacherId:string):Promise<DashboardData | null> {
   try {
    // 1️⃣ Fetch student count
    const studentCount = await prisma.student.count({
      where: { teacherId, status: true },
    });

    // 2️⃣ Fetch task count
    const taskCount = await prisma.task.count({
      where: { teacherId },
    });

    // 3️⃣ Fetch completed submissions count
    const completedSubmissions = await prisma.taskSubmission.count({
      where: { teacherId, status: true },
    });

    // 4️⃣ Fetch all graded submissions for average grade
    const gradedSubmissionsWithTask = await prisma.taskSubmission.findMany({
  where: { teacherId, grade: { gte: 0 } },
  select: {
    grade: true,
    task: { select: { maxMarks: true } },
  },
});

// Compute average percentage
const averageGradePercentage = gradedSubmissionsWithTask.length
  ? gradedSubmissionsWithTask.reduce((sum, sub) => {
      const grade = sub.grade ?? 0; // Default null grades to 0
      const pct = (grade / sub.task.maxMarks) * 100;
      return sum + pct;
    }, 0) / gradedSubmissionsWithTask.length
  : 0;
    // 5️⃣ Fetch weekly submission trend
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const submissionsByDate = await prisma.taskSubmission.findMany({
      where: {
        teacherId,
        createdAt: { gte: fourWeeksAgo },
      },
      select: { createdAt: true },
    });

    // Initialize weekly buckets
    const weeklySubmissions = Array(4).fill(0);
    submissionsByDate.forEach((submission) => {
      const weekIndex = Math.floor(
        (new Date().getTime() - new Date(submission.createdAt).getTime()) /
        (7 * 24 * 60 * 60 * 1000)
      );
      if (weekIndex >= 0 && weekIndex < 4) {
        weeklySubmissions[3 - weekIndex] += 1;
      }
    });

    // 6️⃣ Fetch top students by sum of marks
    const topStudentsByMarks = await prisma.taskSubmission.groupBy({
      by: ['studentId'],
      where: {
        teacherId,
        marks: { gte: 0 },
      },
      _sum: { grade: true },
      orderBy: {
        _sum: { marks: 'desc' },
      },
      take: 5,
    });

    // Fetch student info
    const topStudents = await Promise.all(
      topStudentsByMarks.map(async (s) => {
        const student = await prisma.student.findUnique({
          where: { id: s.studentId },
          select: { name: true, email: true },
        });

        return {
          name: student?.name || 'Unknown',
          email: student?.email || '',
          totalMarks: s._sum.grade || 0, 
        };
      })
    );

    // ✅ Assemble dashboard data
    const data: DashboardData = {
      studentCount,
      taskCount,
      totalSubmissions: completedSubmissions,
      averageGradePercentage,
      weeklySubmissions,
      topStudents,
    };

    return data;
  } catch (error) {
    console.error('Error occurred while fetching teacher dashboard data:', error);
    return null;
  }
}
}
