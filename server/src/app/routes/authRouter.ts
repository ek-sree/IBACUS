import { refreshTokenHandler } from '../../middleware/refreshTokenHandler.js';
import AuthController from '../controller/authController.js';
import express from 'express'

const authRouter = express.Router();

const authController = new AuthController();


authRouter.post("/google/teacher", authController.loginGoogleTeacher);
authRouter.post("/microsoft/teacher", authController.loginMicrosoftTeacher);
// authRouter.post("/auth/google/student", authController.loginGoogle);
// authRouter.post("/auth/microsoft/student", authController.loginMicrosoft);

authRouter.post("/logout", authController.logout)

authRouter.post('/refresh-token', refreshTokenHandler);

export {authRouter}