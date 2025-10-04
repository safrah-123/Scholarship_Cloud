import express from 'express';
import usercontroller from './Usercontroller.js';
import scholarshipcontroller from './scholarshipcontroller.js';
const controller =express.Router();
controller.use('/user',usercontroller);
controller.use('/scholar',scholarshipcontroller);
export default controller
