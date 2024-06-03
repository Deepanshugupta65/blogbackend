import connectdb from "./db/index.js";
import dotenv from "dotenv"
import { app } from "./app.js";

dotenv.config({
    path:'./env'
})
connectdb()

// connect express  app with databse
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(` server is running port :${process.env.PORT} `);
    })
})
.catch((err)=>{
    console.log("Mongodb connection failed",err)
})