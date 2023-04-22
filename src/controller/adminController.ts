import express, { Request, Response, NextFunction } from "express";
import { adminSchema, GeneratePassword, userSchema,GenerateSalt, GenerateSignature,option, loginSchema, validatePassword } from "../utils/utility";
import { UserInstance, UserAttribute } from "../model/userModel";
import { v4 as uuidv4 } from "uuid";
//import { fromAdminMail, userSubject } from "../config";
import { JwtPayload } from "jsonwebtoken";

 //superAdmin
 export const superAdmin = async (req:JwtPayload, res: Response) => {
    try {
      const { email, phone, password,firstName,lastName,company } = req.body;
  
      const uuiduser = uuidv4();
  
      const validateResult = adminSchema.validate(req.body, option);
  
      if (validateResult.error) {
        return res.status(400).json({
          Error: validateResult.error.details[0].message,
        });
      }
  
      //generate salt
      const salt = await GenerateSalt();
      const adminPassword = await GeneratePassword(password, salt);
  
      // //check if the admin exist
      const Admin = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as UserAttribute;

      // create Admin
      if (!Admin) {
        await UserInstance.create({
          id: uuiduser,
          email,
          password: adminPassword,
          firstName,
          lastName,
          salt,
          company,
          phone,
          verified: true,
          role:"superadmin",
          photo:""
        });
        
       
        //check if the admin exist
        const Admin = (await UserInstance.findOne({
          where: { email: email },
        })) as unknown as UserAttribute;
        //Generate a signature
        let signature = await GenerateSignature({
          id: Admin.id,
          email: Admin.email,
          verified: Admin.verified,
        });
  
        return res.status(201).json({
          message: "admin created successfully",
          signature,
          verified: Admin.verified,
        });
      }
      return res.status(400).json({
        message: "admin already exist",
      });
    } catch (err: any) {
      ///console.log(err.name)
      console.log(err.message);
      // console.log(err.stack)
      res.status(500).json({
        Error: "Internal server Error",
        route: "/admins/create-super-admin",
      });
    }
  };
//login ============login ===========
  export const Login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      const validateResult = loginSchema.validate(req.body, option);
  
      if (validateResult.error) {
        return res.status(400).json({
          Error: validateResult.error.details[0].message,
        });
      }
  
  //check if the user exists
  
  const User = await UserInstance.findOne({
    where: { email:email },
  }) as unknown as UserAttribute;
  if(User.verified === true){
    const validation = await validatePassword(password, User.password, User.salt)
    if(validation){
      let signature = await GenerateSignature({
        id:User.id,
        email:User.email,
        verified:User.verified,
      })
      return res.status(200).json({
        message:"You have successfully logged in",
        signature,
        email:User.email,
        verified:User.verified,
        role:User.role
      })
    }
  }
  return res.status(400).json({
   Error:"Wrong username and password or not a verified user" 
  })
    } catch (err: any) {
      ///console.log(err.name)
      console.log(err.message);
      // console.log(err.stack)
      res.status(500).json({
        Error: "Internal server Error",
        route: "/admins/login",
      });
    }
  };

// Admin create user ========== Amin create User.

export const registerUser = async(req:JwtPayload, res: Response)=>{
    try {
        
      const{
        email,
        password,
        firstName,
        lastName,
        company,
        phone,
         
        
      }=req.body
      const id = req.user.id
    
      const validateResult = userSchema.validate(req.body, option);
      const uuiduser = uuidv4();
      
          if (validateResult.error) {
            return res.status(400).json({
              Error: validateResult.error.details[0].message,
            });
          }
           //generate salt
           const salt = await GenerateSalt();
           const userPassword = await GeneratePassword(password, salt);
    
            //check if the vendor exist
            const User = (await UserInstance.findOne({
              where: { email: email },
            })) as unknown as UserAttribute;
    
            const Admin = await UserInstance.findOne({
              where: { id: id },
            }) as unknown as UserAttribute;
            if(Admin.role === "admin" || Admin.role === "superadmin"){
              if (!User){
                const createUser = await  UserInstance.create({
                    id: uuiduser,
                    email,
                    password:userPassword,
                    firstName,
                    lastName,
                    salt,
                    company,
                    phone,
                    verified:false,
                    role:"user",
                    photo:""
                })
                return res.status(201).json({
                  message: "User created successfully",
                  createUser
                });
               }
               return res.status(400).json({message:"user already exist"})
            }
    
    
        
           return res.status(400).json({message:"unauthorised"})
    
    } catch (err:any) {
      console.log(err.message);
          // console.log(err.stack)
          res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/register-user",
          });
        
    }
      }
      
    
      