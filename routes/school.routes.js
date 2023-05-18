const router = require("express").Router()
const School = require('../app/controller/schools.coontroller')



router.get("/getGovernorate/:id", School.getGovernorate)