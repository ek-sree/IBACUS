import { createRequire } from "module";
const require = createRequire(import.meta.url); 
const multer = require("multer");

console.log(" Multer version:", multer().constructor.name);
