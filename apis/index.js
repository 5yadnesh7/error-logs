const express = require("express");
const { PORT } = require("./constants");
const app = express();
const bodyParser = require("body-parser");
const db = require("./connection");
const CronJob = require('cron').CronJob;
const { insertErr, getErr, updateErr, insertUser, getUser, insertStatus, getStatus, deleteErr, updateUser, updateStatus } = require("./service");
const { autoDeleteOldError } = require("./methods");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Home Page")
})

app.post("/insertErr", insertErr)
app.get("/getErr", getErr)
app.post("/updateErr", updateErr)
app.post("/deleteErr", deleteErr)

app.post("/insertUser", insertUser)
app.get("/getUser", getUser)
app.post("/updateUser", updateUser)

app.post("/insertStatus", insertStatus)
app.get("/getStatus", getStatus)
app.post("/updateStatus", updateStatus)

const job = new CronJob('0 0 * * *', autoDeleteOldError)

db.mongoConnect((db) => {
    app.db = db;
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
        job.start()
    })
});