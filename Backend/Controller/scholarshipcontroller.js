import express from 'express';
import scholarshipservice from '../Service/scholarshipservice.js';
const scholarshipcontroller=express.Router();
scholarshipcontroller.post('/add',scholarshipservice.add);
scholarshipcontroller.delete('/delete',scholarshipservice.delete1)
scholarshipcontroller.get('/get_details',scholarshipservice.get_details)
scholarshipcontroller.get('/get_scholar',scholarshipservice.get_scholar)
scholarshipcontroller.post('/submit_application', scholarshipservice.submit_application);
scholarshipcontroller.get('/get_application', scholarshipservice.get_application);
scholarshipcontroller.delete('/delete_application', scholarshipservice.delete_application);
scholarshipcontroller.post('/accept_application', scholarshipservice.accept_application);
scholarshipcontroller.get('/check_scholar', scholarshipservice.check_scholar);
scholarshipcontroller.get('/get_application1', scholarshipservice.get_application1);
export default scholarshipcontroller;

