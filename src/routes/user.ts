import express from "express"
import { userLogin } from "../controller/userController"


const router = express.Router();

router.post("/login", userLogin)




export default router