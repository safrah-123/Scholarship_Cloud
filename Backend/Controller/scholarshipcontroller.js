import express from 'express';
import scholarshipservice from '../Service/scholarshipservice.js';
const scholarshipcontroller=express.Router();
scholarshipcontroller.post('/add',scholarshipservice.add);
scholarshipcontroller.delete('/delete',scholarshipservice.delete1)
scholarshipcontroller.get('/get_details',scholarshipservice.get_details)
scholarshipcontroller.get('/get_scholar',scholarshipservice.get_scholar)
export default scholarshipcontroller;

