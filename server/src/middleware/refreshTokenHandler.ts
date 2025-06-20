import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { StatusCode } from "../interface/statusCode.js";

const accessTokenExpire = "15m";
const refreshTokenExpire = "7d";

export const refreshTokenHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(StatusCode.Unauthorized).json({ message: "Refresh token missing" });
      return;
    }

    let payload: any;
    try {
      payload = jwt.verify(refreshToken, config.jwt_refresh_key);
    } catch (err) {
      console.error("Invalid refresh token", err);
      res.status(StatusCode.Unauthorized).json({ message: "Invalid refresh token" });
      return;
    }

    const { id, role } = payload;

    const newAccessToken = jwt.sign({ id, role }, config.jwt_access_key, { expiresIn: accessTokenExpire });
    const newRefreshToken = jwt.sign({ id, role }, config.jwt_refresh_key, { expiresIn: refreshTokenExpire });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(StatusCode.OK).json({
      message: "Token refreshed",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh error", error);
    res.status(StatusCode.InternalServerError).json({ message: "Internal server error" });
  }
};
