import { client,dbname } from "../Model/index.js";
import auth from "../Auth/Auth.js"
const login=async(req,res)=>{
    await client.connect();
    try{
        let db=client.db(dbname);
        let email=req.body.email;
        let data=await db.collection('user').findOne({email:email});
        if(data){
              let password=req.body.password;
              let pass1=data.password;
              if(await auth.compare(password,pass1)){
                let payload={
                    name:data.firstName,
                    age:data.age,
                    email:data.email
                }
                let token=await auth.tokengen(payload);
                res.status(200).send({
                    message:"Logged in successfull",
                    payload:token,
                    name:data.firstName, 
                })
              }
              else{
                 res.status(400).send({
                message:"Password wrong"
            })
              }
        }
        else{
            res.status(400).send({
                message:"No user found"
            })
        }
        }
    catch(err){
            res.status(500).send({
                message:"Error plz try again later",
                error: err.message
            })
    }
}
const signup=async(req,res)=>{
    try{
        await client.connect()
        let db=client.db(dbname);
        let {firstName,lastName,gender,age,email,phone,password,confirmPassword,}=req.body;
        let data=await db.collection('user').findOne({email:email});
        if(password!=confirmPassword){
            res.status(404).send({
                message:"password not matching"
            })
            return 
        }
        if(data){
            res.status(400).send({
                message:"Already registered"
            })
            return 
        }
        else{
            let hashed=await auth.hash(password);
            await db.collection('user').insertOne({
              firstName,lastName,gender,age,email,phone,password:hashed,
            })
            res.status(200).send({
                message:"Account created successfully"
            })
        }
    }
    catch(err){
            res.status(500).send({
                message:"Plz tryagain later",
                error: err.message
            })
    }
}
export default{login,signup}