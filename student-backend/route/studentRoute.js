import express from "express"
import { authenticate } from "../middleware/Authorization.js";
import { addStudent, deletedStudent, getAllStudents, updateStudent, upload } from "../controller/studentController.js";

const studentRoute=express.Router()
studentRoute.post("/addStudents", authenticate, upload, addStudent);
studentRoute.post("/:id",authenticate,updateStudent)
studentRoute.get('/getAllStudents', authenticate, getAllStudents);
studentRoute.delete('/deletedStudent', deletedStudent);

export {studentRoute}