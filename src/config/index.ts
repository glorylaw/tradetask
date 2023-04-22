import  {Sequelize} from 'sequelize';

import dotenv from "dotenv"
dotenv.config()

export const db = new Sequelize('database', 'username', 'password', {
    storage:".trade.sqlite",
    dialect:"sqlite",
    logging:false // or any other dialect that you're using
});

export const APP_SECRET = process.env.APP_SECRET as string

export const GMAIL_USER = process.env.GMAIL_USER
export const GMAIL_PASS = process.env.GMAIL_PASS