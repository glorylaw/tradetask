import express from "express"
import {registerUser, Login, superAdmin } from "../controller/adminController"


import {auth} from "../middleware/authorization"

const router = express.Router()

router.post("/create-super-admin" , superAdmin)
router.post("/register-user" ,auth,  registerUser)
router.post("/login", Login)


export default router
