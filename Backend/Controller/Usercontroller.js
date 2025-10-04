import express from 'express';
import Userservice from '../Service/Userservice.js';
const usercontroller=express.Router();
usercontroller.post('/login',Userservice.login);
usercontroller.post('/signup',Userservice.signup);
export default usercontroller
