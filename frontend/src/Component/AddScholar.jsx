import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../CSS/Addscholar.css";

function Addscholar() {
  const navigate = useNavigate();
  const option1 = ["True", "False"];

  const [scholarshipName, setScholarshipName] = useState("");
  const [shortinfo,setShortinfo]=useState("");
  const [scholarInfo, setScholarInfo] = useState("");
  const [income, setIncome] = useState("");
  const [ten, setTen] = useState("");
  const [twelve, setTwelve] = useState("");
  const [date, setDate] = useState("");

  const handle_submit = async (e) => {
    e.preventDefault(); 
    try {
      let res = await axios.post("https://azhyr-gpa3bwexfhcrdqbb.southeastasia-01.azurewebsites.net/scholar/add", {
        scholarshipName,
        shortinfo,
        scholarInfo,
        income,
        ten,
        twelve,
        date,
      });
      if (res.status === 200) {
        toast.success("Scholarship added successfully");
        navigate("/Dashboard");
      }
    } catch (err) {
      toast.error("Error adding scholarship: " + err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Scholarship Details</h2>
      <form className="scholarship-form" onSubmit={handle_submit}>
        <label>
          Scholarship Name
          <input
            type="text"
            value={scholarshipName}
            onChange={(e) => setScholarshipName(e.target.value)}
            required
          />
        </label>
          <label>
          Scholarship Short info
          <input
            type="text"
            value={shortinfo}
            onChange={(e) => setShortinfo(e.target.value)}
            required
          />
        </label>

        <label>
          Info (Eligibility criteria)
          <textarea
            value={scholarInfo}
            onChange={(e) => setScholarInfo(e.target.value)}
            required
          />
        </label>

        <label>Income:</label>
        <select
          className="select1"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          required
        >
          <option value="">--Select--</option>
          {option1.map((item, id) => (
            <option value={item} key={id}>
              {item}
            </option>
          ))}
        </select>

        <label>Marksheet 10:</label>
        <select
          className="select1"
          value={ten}
          onChange={(e) => setTen(e.target.value)}
          required
        >
          <option value="">--Select--</option>
          {option1.map((item, id) => (
            <option value={item} key={id}>
              {item}
            </option>
          ))}
        </select>

        <label>Marksheet 12:</label>
        <select
          className="select1"
          value={twelve}
          onChange={(e) => setTwelve(e.target.value)}
          required
        >
          <option value="">--Select--</option>
          {option1.map((item, id) => (
            <option value={item} key={id}>
              {item}
            </option>
          ))}
        </select>

        <label>
          Deadline Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            Add Application
          </button>
        </div>
      </form>
    </div>
  );
}

export default Addscholar;
