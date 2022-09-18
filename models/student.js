// 此檔案用作制作mongoDB中student的schema

const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  age: { type: Number, default: 18, max: [80, "超齡了"] },
  scholarship: {
    merit: { type: Number, min: 0, max: [5000, "獎學金超額了"] },
    other: { type: Number, min: 0 },
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
