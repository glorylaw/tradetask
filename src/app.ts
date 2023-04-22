//import createError from 'http-errors';
import express,{Request,Response,NextFunction} from "express"
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan'
import cors from "cors"
import {db} from "./config"
import indexRouter from "./routes/index"

import adminRouter from "./routes/Admin"
import userRouter from "./routes/user"

import dotenv from "dotenv"
dotenv.config()


db.sync().then(()=>{
  console.log("db connected successfully")
}).catch(err=>{
  console.log(err)
})



const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter)

app.use("/users",userRouter)

app.use("/admins", adminRouter)

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });



const port = 7000
app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`)
})

export default app;
