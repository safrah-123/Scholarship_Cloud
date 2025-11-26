import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogout from '../Hooks/useLogout';
import "../CSS/Applied.css";
import axios from 'axios';
import toast from 'react-hot-toast';
function Applied() {
  const navigate = useNavigate();
  const logout = useLogout();
  const name = sessionStorage.getItem("name");
  console.log(name);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const accept=async(result,email,scholarName)=>{
    if(result){
      try{
        let res=await axios.post("http://localhost:3000/scholar/accept_application",{email,name,scholarName});
        if(res.status==200){
          toast.success("Application accepted successfully");
          if(name==="admin"){
            get_data1();
        }
        else{
          get_data();
        }
      }
    }
    catch(err){
        toast.error("Try again Later");
    }
  }
}
 const get_data1 = async () => {
  try{
    let res=await axios.get("http://localhost:3000/scholar/get_application1");
    if(res.status==200){
      setData1(res.data.data);
    }
  }
  catch(err){
      toast.error("Try again Later");
  }
}
  const get_data = async () => {
    try {
      let params = { name: name };
      let res = await axios.get("http://localhost:3000/scholar/get_application", { params });
      if (res.status === 200) {
        setData(res.data.data);
      } else if (res.status === 400) {
        toast.error("Error fetching data");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  const delete1 = async (result,email,scholarName) => {
    if (result) {
      try {
        let params = { email:email,name:name,scholarName: scholarName };
        let res = await axios.delete("http://localhost:3000/scholar/delete_application", { params });
        if (res.status === 200) {
          toast.success("Application deleted successfully");
          if(name==="admin"){
            get_data1();
        }
        else{
          get_data();
        }
      }
    }
       catch (err) {
        toast.error("Error deleting application");
      }
    }
  };

  useEffect(() => {
    get_data();
  }, []);
  useEffect(() => {
    get_data1();
  }, []);
  return (
    name === "admin" ? (
      <>
        <div className="applied-header">
          <div className='applied-header-inner'>
            <h1 className="applied-title">ADMIN PANEL</h1>
            <button className="applied-home" onClick={() => navigate('/Dashboard')}>Home</button>
            <button className="applied-logout" onClick={() => logout()}>Logout</button>
          </div>
        </div>
        <div className="applied-content">
          {data1.length === 0 ? (
            <h2 style={{ textAlign: 'center', marginTop: '20px' }}>No applications found</h2>
          ) : (
            data1.map((item, index) => (
              <div className="applied-card" key={index}>
                <h2><b>Scholarship name:</b> {item.scholarName}</h2>
                <p><strong>Applicant name:</strong> {item.name}</p>
                <p><strong>Applied Date:</strong> {item.appliedAt}</p>
                <p><strong>Application Status:</strong> {item.status}</p>
                {
                  name==="admin"?(<p><strong>Result:</strong> {item.result}</p>):(null)
                }
                <div className="card-btn1">
                  {
                  item.status==="accepted"?(null):( <button
                    className="accept-view-details"
                    onClick={() => {
                      const res = window.confirm("Do you want to accept this form?");
                      accept(res, item.email,item.scholarName);
                    }}
                  >
                   Accept
                  </button>)
                  }
                 
                  <button
                    className="reject-view-details"
                    onClick={() => {
                      const res = window.confirm("Do you want to reject this form?");
                      delete1(res, item.email,item.scholarName);
                    }}
                  >
                   Reject 
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </>
    ) : (
      <>
        <div className="applied-header">
          <div className='applied-header-inner'>
            <h1 className="applied-title">SCHOLARSHIP</h1>
            <button className="applied-home" onClick={() => navigate('/Dashboard')}>Home</button>
            <button className="applied-logout" onClick={() => logout()}>Logout</button>
          </div>
        </div>
        <div className="applied-content">
          {data.length === 0 ? (
            <h2 style={{ textAlign: 'center', marginTop: '20px' }}>No applications found</h2>
          ) : (
            data.map((item, index) => (
              <div className="applied-card" key={index}>
                <h2><b>Scholarship name:</b> {item.scholarName}</h2>
                <p><strong>Applicant name:</strong> {item.name}</p>
                <p><strong>Applied Date:</strong> {item.appliedAt}</p>
                <p><strong>Application Status:</strong> {item.status}</p>
                <div className="card-btn1">
                  <button
                    className="delete-view-details"
                    onClick={() => {
                      const res = window.confirm("Do you want to reject your form?");
                      delete1(res, item.email,item.scholarName);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </>
    )
  );
}

export default Applied;
