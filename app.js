const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const Student = require("./models/student");

// Middle Ware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

mongoose.set("useFindAndModify", false);

// Connect To DB
mongoose
  .connect("mongodb://localhost:27017/studentDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect DB Successful");
  })
  .catch((err) => {
    console.log("Fail to connect DB");
    console.log(err);
  });

// route
app.get("/", (req, res) => {
  res.send("This is homepage.");
});

app.get("/students/insert", (req, res) => {
  res.render("studentInsert.ejs");
});

app.get("/students", async (req, res) => {
  try {
    //先撈資料
    let data = await Student.find();
    console.log(data);
    //再導入students.ejs中
    res.render("students.ejs", { data });
  } catch {
    res.send("Error with Finding Data");
  }
});

app.get("/students/:id", async (req, res) => {
  //抓取 :id
  let { id } = req.params;
  console.log(req.params);
  try {
    let data = await Student.findOne({ id });
    if (data !== null) {
      res.render("studentPage.ejs", { data });
    } else {
      res.send("Cannot find this Student! Please enter a valid id.");
    }
  } catch (err) {
    res.send("Error!");
    console.log(err);
  }
});

//提交表單
app.post("/students/insert", (req, res) => {
  //直接在req.body表單中提取
  let { id, name, age, merit, other } = req.body;

  // Create Studetn
  let newStudent = new Student({
    id,
    name,
    age,
    scholarship: {
      merit,
      other,
    },
  });

  newStudent
    .save()
    .then(() => {
      console.log(newStudent);
      console.log("Student accepted!");
      res.render("accept.ejs");
    })
    .catch((err) => {
      console.log("Student not accept.");
      console.log(err);
      res.render("reject.ejs");
    });
});

app.get("/students/edit/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let data = await Student.findOne({ id });
    if (data !== null) {
      res.render("edit.ejs", { data });
    } else {
      res.send("Cannot find Student.");
    }
  } catch {
    res.send("Error!");
  }
});

// Edit
app.put("/students/edit/:id", async (req, res) => {
  console.log(req.body); //User input update data

  // Update MongoDB
  let { id_user } = req.params;
  // 先把所有資料由 User input取出
  let { id, name, age, merit, other } = req.body;
  try {
    let d = await Student.findOneAndUpdate(
      { id_user },
      { id, name, age, scholarship: { merit, other } },
      { new: true, runValidators: true }
    );
    res.redirect(`/students/${id}`);
  } catch {
    res.render("reject.ejs");
  }
});

// Delete
app.delete("/students/delete/:id", (req, res) => {
  let { id } = req.params;
  console.log({ id });
  Student.deleteOne({ id })
    .then((msg) => {
      console.log(msg);
      res.send("Delete Successfully.");
    })
    .catch((err) => {
      console.log(err);
      res.send("Delete failed.");
    });
});

app.get("/*", (req, res) => {
  res.status(404);
  res.send("not allowed");
});

// Server
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
