import { Request, Response } from "express";
import { AuthUseCase } from "../use-case/authUseCase.js";
import { StatusCode } from "../../interface/statusCode.js";

export default class AuthController{
    private authUseCase:AuthUseCase;

    constructor(){
        this.authUseCase = new AuthUseCase();
    }

    loginGoogleTeacher= async (req:Request,res:Response)=>{
        try {
           const { code } = req.body;
    try {
      const result = await this.authUseCase.teacherLoginGoogle(code);
      res.cookie("refreshToken", result.refreshToken, { httpOnly: true });
      res.status(result.status).json({ message: result.message, data: result.teacher, accessToken: result.accessToken });
    } catch {
      res.status(StatusCode.InternalServerError).json({ message: "Internal server error" });
    }
        } catch (error) {
            console.log("Error in register", error);
            res.status(StatusCode.InternalServerError).json({ message: "Internal server error"});
        }
    }

loginMicrosoftTeacher = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const result = await this.authUseCase.teacherLoginMicrosoft(token);
    res.cookie("refreshToken", result.refreshToken, { httpOnly: true });
    
    res.status(result.status).json({
      message: result.message,
      data: result.teacher,
      accessToken: result.accessToken,
    });
  } catch (error) {
    console.error("Error in Microsoft login:", error);
    res.status(StatusCode.InternalServerError).json({ message: "Microsoft login failed" });
  }
};

  logout=async(req:Request, res:Response)=>{
    try {
      res.clearCookie('refreshToken');
      res.status(204).json({message:'Logout successfully'});
    } catch (error) {
      console.log("Error occured while logouting",error)
      res.status(StatusCode.InternalServerError).json({message:"Internal Server Error"})
    }
  }

}