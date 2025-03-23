import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [count, setCount]=useState()
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudents, setSelectedStudents] = useState(new Set());
 const navigate=useNavigate()
  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Token not found! Please login again.");
          return;
        }

        const res = await axios.get("http://localhost:8070/student/getAllStudents", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudents(res.data);
        setCount(res.data.length);
      } catch (err) {
        // toast.error("Error fetching students!");
        console.error(err);
      }
    };

    fetchStudents();
  }, []);

  // Handle search filter
  const filteredStudents = students.filter((student) =>
    [student.name, student.email, student.mobile].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Handle checkbox selection
  const toggleSelect = (id) => {
    const updatedSelection = new Set(selectedStudents);
    updatedSelection.has(id) ? updatedSelection.delete(id) : updatedSelection.add(id);
    setSelectedStudents(updatedSelection);
  };

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    if (selectedStudents.size === 0) {
      alert("No students selected for deletion!");  // Use alert instead of toast
      return;
    }
  
    const confirmed = window.confirm("Are you sure you want to delete selected students?");
    if (!confirmed) return;
  
    try {
      const token = localStorage.getItem("token");
  
      await axios.delete("http://localhost:8070/student/deletedStudent", {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids: Array.from(selectedStudents) }, // Correct way to send data in DELETE request
      });
  
      // Remove deleted students from the list
      setStudents(students.filter((student) => !selectedStudents.has(student._id)));
      setSelectedStudents(new Set());
      
      alert("Selected students deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting students!");
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      {/* <ToastContainer /> */}
<div className="flex gap-4 ">
      <h1 className="text-3xl font-bold mb-4">Student List</h1>
      <span className="font-bold text-3xl">({count})</span>
      </div>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name, email, or mobile..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      {/* Delete Selected Button */}
      <button
        onClick={handleBulkDelete}
        disabled={selectedStudents.size === 0}
        className={`mb-4 px-4 py-2 rounded text-white ${
          selectedStudents.size > 0 ? "bg-red-500 hover:bg-red-600" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Delete Selected
      </button>
      <button onClick={()=>navigate("/addStudent")} className="bg-green-700 cursor-pointer px-4 py-2 border rounded ml-4  text-black ">add Student</button>
   

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedStudents(e.target.checked ? new Set(students.map((s) => s._id)) : new Set())
                  }
                  checked={selectedStudents.size === students.length}
                />
              </th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Age</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Mobile</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student._id} className="border-t">
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(student._id)}
                      onChange={() => toggleSelect(student._id)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    {student.image ? (
                      <img
                        src={student.image}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover border"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/50")}
                      />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{student.name}</td>
                  <td className="px-4 py-2">{student.age}</td>
                  <td className="px-4 py-2">{student.email}</td>
                  <td className="px-4 py-2">{student.mobile}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 p-4">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
