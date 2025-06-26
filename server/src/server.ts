import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/index.js';
import { authRouter } from './app/routes/authRouter.js';
import { teacherRouter } from './app/routes/teacherRouter.js';
import { taskRouter } from './app/routes/taskRouter.js';
import { studentRouter } from './app/routes/studentRouter.js';
import { limiter } from './middleware/rateLimitter.js';
import helmet from 'helmet';


const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');  
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); 
    next();
  });

//  Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: config.CORS_KEY,                      
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
   optionsSuccessStatus: 204 
}));

app.use(helmet());
app.use(limiter);



// Routes
app.use('/api/auth', authRouter);
app.use('/api/teacher', teacherRouter);
app.use('/api/task', taskRouter);
app.use('/api/student', studentRouter);


app.listen(port, () => {
  console.log(` Server running on http://localhost:${port}`);
});

export default app;
