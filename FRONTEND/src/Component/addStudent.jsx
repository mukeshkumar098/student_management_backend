import React, { useEffect, useState } from "react";
import axios from "axios";

const AddStudent = () => {
  const [students, setStudents] = useState([]);
  const [newStudents, setNewStudents] = useState([
    { name: "", age: "", email: "", mobile: "", image: null },
  ]);
  const [showForm, setShowForm] = useState(false);

  // Fetch Students
  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found! Please login again.");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8070/student/getAllstudent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students:", err.response?.data || err.message);
      }
    };

    fetchStudents();
  }, []);

  // Handle Form Input Change
  const handleChange = (index, e) => {
    const { name, value, type, files } = e.target;
    const updatedStudents = [...newStudents];
    updatedStudents[index][name] = type === "file" ? files[0] : value;
    setNewStudents(updatedStudents);
  };

  // Add More Student Fields
  const handleAddMore = () => {
    setNewStudents([...newStudents, { name: "", age: "", email: "", mobile: "", image: null }]);
  };

  // Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token not found! Please login again.");
      return;
    }

    const formData = new FormData();

    newStudents.forEach((student, index) => {
      formData.append(`students[${index}][name]`, student.name);
      formData.append(`students[${index}][age]`, student.age);
      formData.append(`students[${index}][email]`, student.email);
      formData.append(`students[${index}][mobile]`, student.mobile);
      if (student.image) {
        formData.append(`students[${index}][image]`, student.image);
      }
    });

    try {
      const res = await axios.post("http://localhost:8070/student/addStudents", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setStudents([...students, ...res.data]);
      setNewStudents([{ name: "", age: "", email: "", mobile: "", image: null }]);
      setShowForm(false);
    } catch (err) {
      console.error("Error adding student:", err.response?.data || err.message);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Student List</h1>

      <button onClick={() => setShowForm(true)} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Add Student
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded-lg w-full max-w-md">
          {newStudents.map((student, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={student.name}
                onChange={(e) => handleChange(index, e)}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={student.age}
                onChange={(e) => handleChange(index, e)}
                required
                className="w-full p-2 border rounded mt-2"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={student.email}
                onChange={(e) => handleChange(index, e)}
                required
                className="w-full p-2 border rounded mt-2"
              />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile No."
                value={student.mobile}
                onChange={(e) => handleChange(index, e)}
                required
                className="w-full p-2 border rounded mt-2"
              />
              <input
                type="file"
                name="image"
                onChange={(e) => handleChange(index, e)}
                className="w-full p-2 border rounded mt-2"
              />
            </div>
          ))}

          <button type="button" onClick={handleAddMore} className="mr-2 px-4 py-2 bg-green-500 text-white rounded-lg">
            Add More
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            Submit
          </button>
        </form>
      )}

      {/* Student List with Image Display */}
      <ul className="bg-white shadow-md rounded-lg p-4 w-full max-w-md mt-4">
        {students.length > 0 ? (
          students.map((student) => (
            <li key={student._id} className="flex items-center p-2 border-b last:border-b-0">
              {student.image && (
                <img
                  src={student.image[0]}  // Backend serves static images
                  alt={student.name}
                  className="w-16 h-16 rounded-full mr-4 object-cover border"
                />
              )}
              <div>
                <p className="font-bold">{student.name} ({student.age} years old)</p>
                <p className="text-sm text-gray-600">{student.email}</p>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No students found.</p>
        )}
      </ul>
    </div>
  );
};

export default AddStudent;
