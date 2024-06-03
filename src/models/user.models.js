import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new Schema(
    {

        username:{
            type:String,
            required:true,
            unique:true,
            lowecase:true,
            trim:true,
            index :true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowecase:true,
            trim:true
        },
        fullname:{
            type:String,
            required:true,
            trim:true
        },
        avatar:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:[true,'Password is required']
        },
        post:[
            {
                type:Schema.Types.ObjectId,
                ref:"Post"
            }
        ],
        refreshToken :{
            type: String
        }
    },
    {
        timestamps:true
    }
)
//  if you user update any filed data save hone se phle encrypt pwd 
userSchema.pre("save",async function(next){
    //  not change any password
    if(!this.isModified("password")) return next();

//   for enter first time password and change or modified in password
    this.password = bcrypt.hash(this.password,10)
    next()
})
// compare the password if you are login 
userSchema.methods.isPassCorrect = async function(password){
       return await bcrypt.compare(password,this.password)
}



export const User = mongoose.model("User",userSchema)