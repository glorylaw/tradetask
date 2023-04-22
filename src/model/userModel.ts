import {DataTypes,Model} from "sequelize"
import { db } from "../config";

export interface UserAttribute{
    id:string;
    email:string;
    password:string;
    firstName:string;
    lastName:string;
    salt:string;
    company:string;
    phone:string;
    verified:boolean,
    role:string,
    photo?: string;
}


export class UserInstance extends Model<UserAttribute>{}

UserInstance.init({
    id:{
        type:DataTypes.UUIDV4,
        primaryKey:true,
        allowNull:false

    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            notNull:{
                msg:"Email adress is required"
            },
            isEmail:{
                msg:"please provide a valid email"
            }
        }
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{
                msg:"password is required",
            },
            notEmpty:{
                msg:"provide a password"
            }
        }
    },
    firstName:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    lastName:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    salt:{
        type:DataTypes.STRING,
        allowNull:false,
        
    },
    company:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    phone:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{
                msg:"provide a phonenumber"
            },
            notEmpty:{
                msg:"provide a phonenumber"
            }
        }
    },

    photo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    verified:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        validate:{
            notNull:{
                msg:"not yet verified"
            },
            notEmpty:{
                msg:"user is not yet verified"
            }
        }
    },
    role:{
        type:DataTypes.STRING,
        allowNull:false,
    },
   
},
{
    sequelize:db,
    tableName:"user"
}
)