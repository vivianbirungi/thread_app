
import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () =>{
    mongoose.set('strictQuery', true);
    if(!process.env.MONGODB_URL) return console.log("DB NOT FOUND");
    if(isConnected) return console.log("Already Connected");
    try{
        console.log("Connecting to");
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
        console.log("Connected to MONGODB");
    }catch(e){
        console.log(e);

    }
}