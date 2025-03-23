import multer from "multer";
import { StudentModel } from "../schemas/studentSchema.js";
import path from "path"


export const getAllStudents = async (req, res) => {
  try {
    const students = await StudentModel.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};






// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure the "uploads" directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Middleware for Handling Multiple File Uploads
export const upload = multer({ storage }).array("images", 10); // Allows multiple images

// Add Students Controller
export const addStudent = async (req, res) => {
  try {
    // Parse students data from request body
    const studentsData = JSON.parse(req.body.students);

    // Attach the correct image to each student
    const students = studentsData.map((student, index) => {
      return {
        name: student.name,
        age: student.age,
        email: student.email,
        mobile: student.mobile,
        image: req.files[index]?.path || null, // Attach corresponding image path
      };
    });

    // Save all students in the database
    const savedStudents = await StudentModel.insertMany(students);
    res.status(201).json(savedStudents);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const deletedStudent = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: "No students selected!" });
    }

    // Delete from DB
    let data = await StudentModel.deleteMany({ _id: { $in: ids } });
    console.log("Deleted Students:", data);

    res.json({ message: "Selected students deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// export const addMultipleStudents = async (req, res) => {
//   const students = req.body;

//   try {
//     const savedStudents = await Student.insertMany(students);
//     res.json(savedStudents);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };


export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, age, email, mobile } = req.body;

  try {
    const student = await StudentModel.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.name = name || student.name;
    student.age = age || student.age;
    student.email = email || student.email;
    student.mobile = mobile || student.mobile;

    if (req.file) {
      student.image = req.file.path; // Update image if a new file is uploaded
    }

    await student.save();
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};