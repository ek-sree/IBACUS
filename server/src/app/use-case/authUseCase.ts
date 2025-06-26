import { createPublicKey } from "crypto";
import config from "../../config/index.js";
import { StatusCode } from "../../interface/statusCode.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwtUtlis.js";
import { OAuth2Client } from "google-auth-library";
import * as jose from "jose";
import jwksClient from "jwks-rsa";
import { AuthRepository } from "../repository/authRepository.js";
import { AuthUser, Role } from "../../interface/IAuth.js";


export class AuthUseCase {
  private authRepo: AuthRepository;
  private googleClient = new OAuth2Client;
  private jwks;

  constructor() {
    this.authRepo = new AuthRepository();
    this.googleClient = new OAuth2Client(
      config.GOOGLE_CLIENT_ID,
      config.GOOGLE_SECRET,
      `${config.CORS_KEY}` // Redirect URI for auth code flow
    );
     this.jwks = jwksClient({
      jwksUri: "https://login.microsoftonline.com/common/discovery/v2.0/keys",
    });
  }

  async teacherLoginGoogle(code: string,role:Role): Promise<{ status: number; message: string; user?: AuthUser,accessToken?:string,refreshToken?:string }> {
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
      let user;
      if (role === Role.TEACHER) {
  user = await this.authRepo.findOrCreateTeacher(
    email!, 
    name!, 
    picture!, 
    role
  );
} else if (role === Role.STUDENT) {
  user = await this.authRepo.findStudent(
    email!, 
    name!, 
    picture!, 
    role
  );
} 

if(!user){
return{status:StatusCode.NotFound,message:"User not found"};
}
    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

      return { status: StatusCode.OK, message: "Success", user,accessToken,refreshToken };
    } catch (error: any) {
      console.log("Error in auth use case", error);
      return { status: StatusCode.InternalServerError, message: error };
    }
  }


     async teacherLoginMicrosoft(
    token: string,
    role: Role
  ): Promise<{
    status: number;
    message: string;
    user?: AuthUser;
    accessToken?: string;
    refreshToken?: string;
  }> {
    try {
      // Decode header and payload
      const decodedHeader = jose.decodeProtectedHeader(token); // { alg, kid, ... }
      const decodedPayload = jose.decodeJwt(token); // { iss, ... }

      // Get public key
      const key = await this.jwks.getSigningKey(decodedHeader.kid!);
      const publicKey = key.getPublicKey();
      const keyObject = createPublicKey(publicKey);

      // Verify token
      const { payload } = await jose.jwtVerify(
        token,
        keyObject,
        {
          issuer: decodedPayload.iss as string,
          audience: config.MS_CLIENT_ID,
        }
      );

      // Extract Microsoft account details
      const name = payload.name as string;
      const email = payload.preferred_username as string;

      if (!email || !name) {
        return { status: 400, message: "Invalid Microsoft token" };
      }

      let user: AuthUser | null = null;
      if (role === Role.TEACHER) {
        user = await this.authRepo.findOrCreateTeacher(email, name, "", role);
      } else if (role === Role.STUDENT) {
        user = await this.authRepo.findStudent(email, name, "", role);
      }

      if (!user) {
        return { status: StatusCode.BadRequest, message: "User not found" };
      }

      const accessToken = generateAccessToken({ id: user.id, role: user.role });
      const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

      return {
        status: StatusCode.OK,
        message: "Success",
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("Microsoft token verification failed", error);
      return {
        status: StatusCode.InternalServerError,
        message: "Token verification failed",
      };
    }
  }

}
