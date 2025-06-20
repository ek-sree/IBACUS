import { prisma } from "../../config/prisma.js";
import { Role } from "../../generated/prisma/index.js";

export class AuthRepository {
  async findOrCreateTeacher(email: string,name:string,avatar:string,role:string) {
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
    return teacher;
  }

 
}
