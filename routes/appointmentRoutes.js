const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { checkRole } = require("../middlewares/roleCheck");
const {
  bookAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  getPatientAppointments,
  getAdminAppointments,
} = require("../controllers/AppointmentController");

// Patient books appointment
router.post("/", auth, checkRole(["patient"]), bookAppointment);

// Doctor views appointments
router.get("/doctor", auth, checkRole(["doctor"]), getDoctorAppointments);

// Doctor updates status
router.patch(
  "/:id/status",
  auth,
  checkRole(["doctor"]),
  updateAppointmentStatus
);


// Admin views all appointments
router.get('/admin', auth, checkRole(["admin"]), getAdminAppointments);

// Patient views appointments
router.get("/patient", auth, checkRole(["patient"]), getPatientAppointments);

module.exports = router;
