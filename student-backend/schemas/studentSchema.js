import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  image: { type: String, required: true },
});

export const StudentModel = mongoose.model('Studentdata', studentSchema);