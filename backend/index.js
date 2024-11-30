import  express from 'express'
import "dotenv/config"
 import  cors from 'cors'
import  morgan from 'morgan'
import { connectDB } from './config/db.js';
import { cleanupExiredOtp } from './jobs/otp.job.js';
import authRoutes from "./routes/auth.route.js"
import { adminProtect, handleToken, userProtect } from './middleware/auth.js';

const app = express();

const port = process.env.PORT ||3000;

// middlewares 
app.use(express.json())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.set("view engine","ejs");
app.use(express.urlencoded({extended:false}))
app.use(morgan("dev"))
connectDB() // db connection 
cleanupExiredOtp()
// routes
app.use("/api/auth",authRoutes)
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});
app.get('/admin',handleToken, adminProtect, (req, res) => {
  res.send('Hello, Admin!');
});
app.get('/user',handleToken, userProtect, (req, res) => {
  res.send('Hello, User!');
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
