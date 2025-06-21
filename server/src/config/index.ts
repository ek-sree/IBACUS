import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 3001,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_SECRET: process.env.GOOGLE_SECRET,
  MS_CLIENT_ID: process.env.MS_CLIENT_ID,
  tenant_id_MS: process.env.tenant_id_MS,
  SECRET_KEY: process.env.SECRET_KEY || "jwt-secret-key",
  CORS_KEY: process.env.CORS_KEY,
  jwt_access_key: process.env.JWT_ACCESS_TOKEN_KEY || "",
  jwt_refresh_key: process.env.JWT_REFRESH_TOKEN_KEY || "",
  CLOUD_NAME: process.env.CLOUD_NAME,
  CLOUD_API_KEY: process.env.CLOUD_API_KEY,
  CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
};

export default config;
