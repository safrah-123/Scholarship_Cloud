import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import useLogout from '../Hooks/useLogout'
import "../CSS/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [scholar, setScholar] = useState([]);
  const name=sessionStorage.getItem('name');
  let logout=useLogout();
  const get_scholar = async () => {
    try {
      let res = await axios.get("http://localhost:3000/scholar/get_scholar");
      if (res.status === 200) {
        setScholar(res.data.data);
      }
    } catch (err) {
      toast.error("Try again later");
    }
  };

  const delete_scholar = async (scholarshipName) => {
    try {
      let res = await axios.delete("http://localhost:3000/scholar/delete", {
        data: { scholarshipName },
      });
      if (res.status === 200) {
        toast.success("Data deleted successfully");
        get_scholar(); // refresh list
      }
    } catch (err) {
      toast.error("Error deleting data");
    }
  };

  useEffect(() => {
    get_scholar();
  }, []); // run only once

  return (
    <>
      <div className="header1">
        <div className="header-inside">
          <h1 className="para1">SCHOLARSHIP</h1>
          {
            name=="admin"?(<button className="Add" onClick={() => navigate("/Addscholar")}>
            ADD
          </button>):null}
          <button className={name=="admin"?"applied":"Add"} onClick={(()=>{
            navigate('/Applied');
          })}>Applied</button>
          <button className="logout" onClick={()=>{
            logout();
          }}>Logout</button>
        </div>
      </div>
      {
        (scholar.length==0)?(<h2 className="page-title">No Scholarships Available at the moment</h2>):(
            <div className="scholarship-container">
        <h2 className="page-title">Available Scholarships</h2>
        <div className="scholarship-list">
          {scholar.map((item, id) => (
            <div className="scholarship-card" key={id}>
              <div className="scholarship-left">
                <h3 className="scholarship-name">{item.scholarshipName}</h3>
                <p className="eligibility">
                <strong>Info:</strong> {item.shortinfo}
              </p>
              <br/>
              <p className="eligibility">
                <strong>Deadline Date:</strong> {item.date}
              </p>
              </div>
              <div className="scholarship-right">
                {
                    name=="admin"?( <div className="times-availed">
                  <button
                    className="details1-btn"
                    onClick={() => delete_scholar(item.scholarshipName)}
                  >
                    Delete
                  </button>
                </div>):null
                }
                <button className="details-btn" 
                onClick={()=>{
                    navigate(`/viewscholar/${item.scholarshipName}`)
                }}
                >View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
        )

      }
      
    </>
  );
}
export default Dashboard;
