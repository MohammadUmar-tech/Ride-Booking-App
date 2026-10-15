import mongoose from "mongoose";

export const connectDb=async(url)=>{

    try {
        const connect=await mongoose.connect(url)
        if(connect){
            console.log('DataBase Connected Successfully');
            
        }
    } catch (error) {
        console.log(`Database connection error ${error}`)
        process.exit(1)
    }

} 