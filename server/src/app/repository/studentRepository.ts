import { prisma } from "../../config/prisma.js";

export class StudentRepository {
    constructor() {}

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
}