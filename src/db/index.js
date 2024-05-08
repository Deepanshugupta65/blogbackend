import mongoose from "mongoose";
import { DB_NAME } from "../constant.js"

const connectdb = async ()=>{
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n Mongodb connected !! db host ${connectionInstance.connection.host}`)
        // console.log(connectionInstance)
    } catch (error) {
        console.log("mongodb connection error",error);
    }
}

export default connectdb;