const router = require("express").Router()
const { model } = require("mongoose")
const School = require('../app/controller/schools.coontroller')
const { Router } = require("express")



router.get("/getAllGovernorate/", School.getAllGovernorate)

router.post("/addGovernorate/", School.addGovernorate)


module.exports = router