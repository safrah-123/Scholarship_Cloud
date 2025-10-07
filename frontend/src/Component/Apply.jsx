import React, { useState } from "react";
import "../CSS/Apply.css";

function Apply() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    district: "",
    incomeDoc: null,
    tenthDoc: null,
    twelfthDoc: null,
  });

  const tamilNaduDistricts = [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
    "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Thanjavur",
    "Dindigul", "Virudhunagar", "Kancheepuram", "Kanyakumari",
    "Namakkal", "Tiruppur", "Sivagangai", "Karur", "Nagapattinam",
    "Ramanathapuram", "Cuddalore", "Perambalur", "Pudukkottai",
    "Theni", "Krishnagiri", "Ariyalur", "Nilgiris", "Tiruvannamalai",
    "Viluppuram", "Dharmapuri"
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("age", formData.age);
      data.append("district", formData.district);
      data.append("incomeDoc", formData.incomeDoc);
      data.append("tenthDoc", formData.tenthDoc);
      data.append("twelfthDoc", formData.twelfthDoc);

      alert("Application submitted successfully!");
      setFormData({
        name: "",
        age: "",
        district: "",
        incomeDoc: null,
        tenthDoc: null,
        twelfthDoc: null,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to submit application!");
    }
  };

  return (
    <div className="form-container">
      <h2>Scholarship Application Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <label>D.O.B:</label>
        <input
          type="text"
          name="dob"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <label>District:</label>
        <select
          name="district"
          value={formData.district}
          onChange={handleChange}
          required
        >
          <option value="">Select District</option>
          {tamilNaduDistricts.map((district, index) => (
            <option key={index} value={district}>
              {district}
            </option>
          ))}
        </select>

        <div className="upload-section">
          <label>Upload Income Certificate:</label>
          <input
            type="file"
            name="incomeDoc"
            accept=".pdf,.jpg,.png"
            onChange={handleChange}
            required
          />

          <label>Upload 10th Mark Sheet:</label>
          <input
            type="file"
            name="tenthDoc"
            accept=".pdf,.jpg,.png"
            onChange={handleChange}
            required
          />

          <label>Upload 12th Mark Sheet:</label>
          <input
            type="file"
            name="twelfthDoc"
            accept=".pdf,.jpg,.png"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="apply1">Submit Application</button>
        <button type="submit" className="apply2">Home</button>
      </form>
    </div>
  );
}
export default Apply;