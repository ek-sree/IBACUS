// src/test.ts
import { createRequire } from "module";
const require = createRequire(import.meta.url); // CommonJS loader
const multer = require("multer");

console.log("✅ Multer version:", multer().constructor.name);
