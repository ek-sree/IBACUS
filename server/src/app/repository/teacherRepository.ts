import { prisma } from "../../config/prisma.js";
import { Role } from "../../generated/prisma/index.js";

interface StudentsData{
    email:string,
    name:string,
    class:string,
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
}
