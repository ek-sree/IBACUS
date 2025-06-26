import { prisma } from "../../config/prisma.js";
import { Role } from "../../generated/prisma/index.js";

export class AuthRepository {
  async findOrCreateTeacher(email: string,name:string,avatar:string,role:string) {
    try {
      let teacher = await prisma.teacher.findUnique({
      where:{email}
    });
    if(!teacher){
      teacher = await prisma.teacher.create({
        data:{
          email,
          name,
          avatar,
          role:role.toLowerCase() as Role
        }
      })
    }
    return teacher || null;
    } catch (error) {
      console.log("Error occured while creating or signing teacher",error)
      return null;
    }
  }

  async findStudent(email:string,name:string,role:string,avatar?:string){
    try {
      const student = await prisma.student.findUnique({where:{email}})
      return student || null;
    } catch (error) {
      console.log("Error occure while finding user in repo",error)
      return null
    }
  }
 
}
