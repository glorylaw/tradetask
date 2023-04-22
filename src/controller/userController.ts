import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { auth } from "../middleware/authorization";
import { UserInstance, UserAttribute } from "../model/userModel";
import {
  GenerateSignature,
  loginSchema,
  option,
  validatePassword,
} from "../utils/utility";
import { v4 as uuidv4 } from "uuid";


export const userLogin = async(req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const validateResult = loginSchema.validate(req.body, option);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    //check if the user exists

    const User= (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as UserAttribute ;
    console.log(User)

    if (User) {
      const validation = await validatePassword(
        password,
        User.password,
        User.salt
      );
      
      if (validation) {
        let signature = await GenerateSignature({
          id: User.id,
          email: User.email,
          verified:User.verified
        });
        return res.status(200).json({
          message: "You have successfully logged in",
          signature,
          email: User.email,
          role: User.role,
        });
      }
    }
    return res.status(400).json({
      Error: "you are not a verifed user",
    });
  } catch (err: any) {
    ///console.log(err.name)
    console.log(err.message);
    // console.log(err.stack)
    res.status(500).json({
      Error: "Internal server Error",
      route: "/users/login",
    });
  }
};