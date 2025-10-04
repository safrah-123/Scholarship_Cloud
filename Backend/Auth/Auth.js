import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const hash=async(password)=>{
    try{
        const salt=await bcrypt.genSalt(Number(process.env.salt));
        const hashed=await bcrypt.hash(password,salt);
        return hashed;
    }
    catch(err){
        throw err;
    }
}
const compare=async(pass,hash)=>{
    try{
        return await bcrypt.compare(pass,hash);
    }
    catch(err){
        throw err;
    }
}
const tokengen =async(payload)=>{
    try{
    return jwt.sign(
        payload,
        process.env.JWT,
        {expiresIn:'1m'}
    )
}
catch(err){
    throw err;
}
}
export default{compare,hash,tokengen}