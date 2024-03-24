const express = require("express")
const path = require("path")
const cors = require("cors")
const app = express()
app.use(cors())
require("../db/connect")
app.use(express.json())
app.use(express.static(path.join(__dirname, "../uploads")))


const teacherRoutes = require("../routes/teacher.routes")
const studentRoutes = require("../routes/student.routes")

app.use("/api/teacher/", teacherRoutes)
app.use("/api/student/", studentRoutes)

app.all("*", (req, res) => {
    res.status(404).send({
        apisStatus: false,
        message: "Invalid URL",
        data: {}
    })
})
module.exports = app