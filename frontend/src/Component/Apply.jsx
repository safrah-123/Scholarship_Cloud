import React, { useEffect, useState } from "react";
import "../CSS/Apply.css";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function Apply() {
  const navigate = useNavigate();
  const { scholar } = useParams();
  const [income, setIncome] = useState("");
  const [ten, setTen] = useState("");
  const [twelve, setTwelve] = useState(""); 
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [district, setDistrict] = useState("");
  const [incomeDoc, setIncomeDoc] = useState("");
  const [tenthDoc, setTenthDoc] = useState("");
  const [twelfthDoc, setTwelfthDoc] = useState("");
  const name=sessionStorage.getItem("name");
  const tamilNaduDistricts = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
    "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram",
    "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam",
    "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram",
    "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni",
    "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur",
    "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
    "Viluppuram", "Virudhunagar"
  ];

  useEffect(() => {
    get_data();
  }, []);

  const get_data = async () => {
    try {
      const res = await axios.get("http://localhost:3000/scholar/get_details", {
        params: { scholarshipName: scholar }
      });
      setIncome(res.data.income);
      setTen(res.data.ten);
      setTwelve(res.data.twelve);
    } catch (err) {
      toast.error("Error fetching scholarship details: " + err.message);
    }
  };
  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFile(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      scholarName: scholar,
      name,
      email,
      age,
      dob,
      district,
      documents: {
        income: incomeDoc,
        tenth: tenthDoc,
        twelfth: twelfthDoc
      }
    };

    try {
      await axios.post("http://localhost:3000/scholar/submit_application", payload);
      toast.success("Application submitted successfully!");
      navigate("/Dashboard");
    } catch (err) {
      toast.error("Error submitting application: " + err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Scholarship Application Form for {scholar}</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />

        <label>D.O.B:</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />

        <label>District:</label>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          required
        >
          <option value="">Select District</option>
          {tamilNaduDistricts.map((dist, index) => (
            <option key={index} value={dist}>
              {dist}
            </option>
          ))}
        </select>

        <div className="upload-section">
          {income === "True" && (
            <>
              <label>Upload Income Certificate:</label>
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={(e) => handleFileChange(e, setIncomeDoc)}
                required
              />
            </>
          )}

          {ten === "True" && (
            <>
              <label>Upload 10th Mark Sheet:</label>
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={(e) => handleFileChange(e, setTenthDoc)}
                required
              />
            </>
          )}

          {twelve === "True" && (
            <>
              <label>Upload 12th Mark Sheet:</label>
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={(e) => handleFileChange(e, setTwelfthDoc)}
                required
              />
            </>
          )}
        </div>

        <div className="btn-grp">
          <button type="submit" className="apply1">Submit Application</button>
          <button
            type="button"
            className="apply2"
            onClick={() => navigate("/Dashboard")}
          >
            Home
          </button>
        </div>
      </form>
    </div>
  );
}

export default Apply;
