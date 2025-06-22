import { refreshTokenHandler } from '../../middleware/refreshTokenHandler.js';
import AuthController from '../controller/authController.js';
import express from 'express'

const authRouter = express.Router();

const authController = new AuthController();


authRouter.post("/google/teacher", authController.loginGoogleTeacher);
authRouter.post("/microsoft/teacher", authController.loginMicrosoftTeacher);
authRouter.post("/google/student", authController.loginGoogleTeacher);
authRouter.post("/microsoft/student", authController.loginMicrosoftTeacher);

authRouter.post("/logout", authController.logout)

authRouter.post('/refresh-token', refreshTokenHandler);

export {authRouter}