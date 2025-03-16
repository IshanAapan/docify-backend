
const express = require("express");
const router = express.Router();
const { applyForDoctor } = require("../controllers/doctorController");
const { getAllDoctors } = require('../controllers/doctorController');


const auth = require("../middlewares/auth"); // Import auth middleware

router.post("/apply", auth, applyForDoctor); // Make sure auth is used
router.get("/getAllDoc",getAllDoctors)
module.exports = router;
