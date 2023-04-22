import Joi from "joi"
import bcrypt from "bcrypt"
import { AuthPayload } from "../interface"
import jwt, { JwtPayload } from "jsonwebtoken"
import {APP_SECRET} from "../config"


export const registerSchema = Joi.object().keys({
    email:Joi.string().required(),
    phone:Joi.string().required(),
    password:Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    //confirm_password:Joi.ref("password")
    confirm_password:Joi.any().equal(Joi.ref("password")).required().
    label("Confirm password").messages({"any.only":"{{#label}} does not match"})

})

 export const option = {
    abortEarly:false,
    errors:{
        wrap:{
            label:""
        }
    }
}

export const GenerateSalt = async()=>{
return await bcrypt.genSalt()
}

export const GeneratePassword = async(password:string, salt:string)=>{
    return await bcrypt.hash(password,salt)
}

export const GenerateSignature = async(payload:AuthPayload)=>{
return jwt.sign(payload, APP_SECRET,{expiresIn:"1d"})
}

export const verifySignature= async(signature:string)=>{
    return jwt.verify(signature, APP_SECRET) as JwtPayload
}


export const loginSchema = Joi.object().keys({
    email:Joi.string().required(),
    password:Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

export const validatePassword = async(enteredPassword:string,savedPassword:string,salt:string)=>{
    return await GeneratePassword(enteredPassword,salt) === savedPassword
}


export const adminSchema = Joi.object().keys({
    email:Joi.string().required(),
    firstName:Joi.string().required(),
    lastName:Joi.string().required(),
    company:Joi.string().required(),
    phone:Joi.string().required(),  
    password:Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')), 
    // confirm_password:Joi.any().equal(Joi.ref("password")).required().
    // label("Confirm password").messages({"any.only":"{{#label}} does not match"})
})

export const userSchema = Joi.object().keys({
    email:Joi.string().required(),
    firstName:Joi.string().required(),
    lastName:Joi.string().required(),
    company:Joi.string().required(),
    phone:Joi.string().required(),  
    password:Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')), 
})

