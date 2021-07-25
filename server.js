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



mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/stats.html"));
});


app.get("/api/workouts", (req,res) => {
  db.Workout.find({})
  
  .then(dbWorkout => {
    // console.log(dbWorkout)
    res.json(dbWorkout);
  })
  // .then(db.Workout.aggregate({
  //   $addFields: {
  //     totalDuration: {$sum: exercises[0].duration}
  //   }
  // }))

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

app.put("/api/workouts/:id", ({body},res) => {
  const id = res._id
  db.Workout.findByIdAndUpdate({id}, {$push: {exercises: {body}}})
   
  .then(dbWorkout => {
    console.log(res)
    res.json(dbWorkout);
  })
  .catch(err => {
    res.json(err);
  })
})

app.get("/api/workouts/range", (req,res) => {
  db.Workout.find({}).limit(7)
  .then(dbWorkout => {
    // console.log(dbWorkout)
    res.json(dbWorkout)
  })
  .catch(err => {
    res.json(err);
  })
})


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});