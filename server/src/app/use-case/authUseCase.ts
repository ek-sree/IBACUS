import { createPublicKey } from "crypto";
import config from "../../config/index.js";
import { StatusCode } from "../../interface/statusCode.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwtUtlis.js";
import { OAuth2Client } from "google-auth-library";
import * as jose from "jose";
import jwksClient from "jwks-rsa";
import { AuthRepository } from "../repository/authRepository.js";

interface Teacher {
  email: string;
  name: string;
  role: string;
  avatar?: string;
}
export class AuthUseCase {
  private authRepo: AuthRepository;
  private googleClient = new OAuth2Client;
  private jwks;

  constructor() {
    this.authRepo = new AuthRepository();
    this.googleClient = new OAuth2Client(
      config.GOOGLE_CLIENT_ID,
      config.GOOGLE_SECRET,
      "http://localhost:5173" // Redirect URI for auth code flow
    );
     this.jwks = jwksClient({
      jwksUri: "https://login.microsoftonline.com/common/discovery/v2.0/keys",
    });
  }

  async teacherLoginGoogle(code: string): Promise<{ status: number; message: string; teacher?: Teacher,accessToken?:string,refreshToken?:string }> {
    try {

      // Exchange authorization code for tokens
      const tokenResponse = await this.googleClient.getToken(code);
      const tokens = tokenResponse.tokens;

      const ticket = await this.googleClient.verifyIdToken({
        idToken: tokens.id_token!,
        audience: config.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return { status: 400, message: "Invalid Google token" };
      }

      const { email, name, picture } = payload;
      const teacher = await this.authRepo.findOrCreateTeacher(
        email!,
        name!,
        picture!,
        "TEACHER"
      );
      if (!teacher) {
        return { status: StatusCode.InternalServerError, message: "Something went wrong" };
      }
    const accessToken = generateAccessToken({ id: teacher.id, role: teacher.role });
    const refreshToken = generateRefreshToken({ id: teacher.id, role: teacher.role });

      return { status: StatusCode.OK, message: "Success", teacher,accessToken,refreshToken };
    } catch (error: any) {
      console.log("Error in auth use case", error);
      return { status: StatusCode.InternalServerError, message: error };
    }
  }


    async teacherLoginMicrosoft(token: string): Promise<{
    status: number;
    message: string;
    teacher?: Teacher;
    accessToken?: string;
    refreshToken?: string;
  }> {
    try {

    const decodedHeader = jose.decodeProtectedHeader(token);
    const decodedPayload = jose.decodeJwt(token); 

    const key = await this.jwks.getSigningKey(decodedHeader.kid);
    const publicKey = key.getPublicKey();
    const keyObject = createPublicKey(publicKey);

    const { payload } = await jose.jwtVerify(token, keyObject, {
      issuer: decodedPayload.iss as string,
      audience: config.MS_CLIENT_ID,
    });


      const { name, preferred_username: email } = payload;
      if (!email || !name) {
        return { status: 400, message: "Invalid Microsoft token" };
      }
 const picture = "";
      const teacher = await this.authRepo.findOrCreateTeacher(
        email as string,
        name as string,
        picture as string,
        "TEACHER"
      );

      const accessToken = generateAccessToken({ id: teacher.id, role: teacher.role });
      const refreshToken = generateRefreshToken({ id: teacher.id, role: teacher.role });

      return { status: StatusCode.OK, message: "Success", teacher, accessToken, refreshToken };
    } catch (error) {
      console.error("Microsoft token verification failed", error);
      return { status: StatusCode.InternalServerError, message: "Token verification failed" };
    }
  }

}
