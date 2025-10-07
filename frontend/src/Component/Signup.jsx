// SignUp.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast'
import "../CSS/Signup.css";

function SignUp() {
   const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  let navigate=useNavigate();


  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
        let res=await axios.post("http://localhost:3000/user/signup",{
            firstName,lastName,gender,age,email,phone,password,confirmPassword
        })
        if(res.status==200){
            toast.success("Account created succesfull");
            navigate('/');
        }
        if(res.status==404){
            toast.error("Password wrong");
        }
        if(res.status==400){
            toast.error("Account allready registered ||Try Different")
        }
    }
    catch(err){
        toast.error(err);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <div className="input-group">
          <label>First Name</label>
          <input type="text" name="firstName" value={firstName} onChange={(e)=>{
            setFirstName(e.target.value);
          }} required />
        </div>

        <div className="input-group">
          <label>Last Name</label>
          <input type="text" name="lastName" value={lastName} onChange={(e)=>{
            setLastName(e.target.value);
          }} required />
        </div>

        <div className="input-group">
          <label>Gender</label>
          <select name="gender" value={gender} onChange={(e)=>{
            setGender(e.target.value);
          }} required>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="input-group">
          <label>Age</label>
          <input type="number" name="age" value={age} onChange={(e)=>{
            setAge(e.target.value);
          }} required />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input type="email" name="email" value={email} onChange={(e)=>{
            setEmail(e.target.value);
          }} required />
        </div>

        <div className="input-group">
          <label>Phone</label>
          <input type="tel" name="phone" value={phone} onChange={(e)=>{
            setPhone(e.target.value);
          }} required />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input type="password" name="password" value={password} onChange={(e)=>{
            setPassword(e.target.value);
          }} required />
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e)=>{
            setConfirmPassword(e.target.value);
          }} required />
        </div>

        <button type="submit" className="signup-btn">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;