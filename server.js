const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");


const PORT = process.env.PORT || 3000;



const db = require("./models")

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));



mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", 
{ 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/stats.html"));
});


app.get("/api/workouts", (req,res) => {
  db.Workout.aggregate([{
    $addFields: {
       totalDuration: {$sum: "$exercises.duration"}
     } 
   }])
  
  .then(dbWorkout => {
    // console.log(dbWorkout)
    res.json(dbWorkout);
  })
 

  .catch(err => {
    res.json(err);
  })
})

app.post("/api/workouts", ({},res) => {
  db.Workout.create({})
  .then(dbWorkout => {
    res.json(dbWorkout);
  })
  .catch(err => {
    res.json(err);
  })
})

app.put("/api/workouts/:id", ({body, params},res) => {
  const id = params.id
  db.Workout.findByIdAndUpdate(id, {$push: {exercises: body}},  { new: true, runValidators: true })
   
  .then(dbWorkout => {
   
    res.json(dbWorkout);
  })
  .catch(err => {
    res.json(err);
  })
})

app.get("/api/workouts/range", (req,res) => {
  db.Workout.aggregate([{
    $addFields: {
       totalDuration: {$sum: "$exercises.duration"}
     } 
   }]).limit(7)
  .then(dbWorkout => {
    
    res.json(dbWorkout)
  })
  .catch(err => {
    res.json(err);
  })
})


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});