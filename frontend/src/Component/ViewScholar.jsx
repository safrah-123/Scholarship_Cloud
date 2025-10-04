import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../CSS/viewScholar.css";

const ViewScholar = () => {
  const [scholar, setScholar] = useState([]);
  const navigate = useNavigate();
  const { str } = useParams(); 
  const name=sessionStorage.getItem('name');

  const get_scholar1 = async () => {
    const params = { scholarshipName: str };
    try {
      let res = await axios.get("https://azhyr-gpa3bwexfhcrdqbb.southeastasia-01.azurewebsites.net/scholar/get_details", { params });
      if (res.status === 200) {
        console.log(res.data.data);
        setScholar(res.data.data);
      }
    } catch (err) {
      toast.error("Try again Later");
    }
  };

  useEffect(() => {
    get_scholar1();
  }, []);

  return (
    <div className="details-container">
      {scholar.map((item, id) => (
        <div key={id} className="details-box">
          <h2>{item.scholarshipName}</h2>
          <p>
            <strong>Short_info:</strong> {item.shortinfo}
          </p>
          <p>
            <strong>Description:</strong> {item.scholarInfo}
          </p>
          {item.income === "True" && (
            <p>
              <strong>Requirements1:</strong> Income Certificate
            </p>
          )}
          {item.ten === "True" && (
            <p>
              <strong>Requirements2:</strong> SSLC MarkSheet
            </p>
          )}
          {item.twelve === "True" && (
            <p>
              <strong>Requirements3:</strong> HSC MarkSheet
            </p>
          )}
          <p>
            <strong>Deadline:</strong> {item.date}
          </p>
          {
            name!="admin"?(<div className="details-buttons">
            <button className="details-btn" onClick={() => alert("Apply Now Clicked!")}>
              Apply Now
            </button>
            <button className="back-btn" onClick={() => navigate("/Dashboard")}>
              Back to List
            </button>
          </div>):
          <div className="details-buttons">
            <button className="back-btn" onClick={() => navigate("/Dashboard")}>
              Back to List
            </button>
          </div>
          }
         
        </div>
      ))}
    </div>
  );
};

export default ViewScholar;
