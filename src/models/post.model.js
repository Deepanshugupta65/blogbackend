import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const postSchema = new Schema(
    {
         image:{
            type:String,
            required:true
         },
         title:{
            type:String,
            required:true
         },
         description:{
            type:String
         },
         fullname:{
            type:String,
            required:true
         },
         owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
         }
    },
    {
        timestamps:true
    }
)

postSchema.plugin(mongooseAggregatePaginate)

export default Post = mongoose.model("Post",postSchema)