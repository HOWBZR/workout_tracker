const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;



const path = require("path");
const app = express();
const db = require("./models");


app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));




mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });


app.get("/api/workouts", (req, res) => {
    db.Workout.find({})
        .then(Workout => {
            console.log(Workout)
            res.json(Workout);
        })
        .catch(err => {
            res.json(err);
        });
});

app.get("/api/workouts/range", (req, res) => { 
    db.Workout.find({})
        .sort({ day: -1 })
        .limit(7)
        .then(Workout => {
            res.json(Workout);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});



app.post("/api/workouts", ({ body }, res) => {
    console.log(body)
    db.Workout.create(body)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        });
});

app.put("/api/workouts/:id", function (req, res) {
    db.Workout.findByIdAndUpdate(req.params.id, { $push: { exercises: req.body } })
        .then(result => res.json(result))
        .catch(err => {
            res.json(err);
        });
})




app.get("/exercise", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/exercise.html"));
});

app.get("/stats", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/stats.html"));
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});