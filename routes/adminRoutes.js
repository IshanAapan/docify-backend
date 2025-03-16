const express = require("express");
const router = express.Router();
const { checkRole } = require("../middlewares/roleCheck");
const {
  getPendingApplications,
  updateApplicationStatus,
  getAllPatients,
  deletePatients,
  deleteDoctors,
  changeDoctorToPatient,
} = require("../controllers/adminController");
const auth = require("../middlewares/auth");

router.get(
  "/applications/pending",
  auth,
  checkRole(["admin"]),
  getPendingApplications
);

router.patch(
  "/applications/:id/status",
  auth,
  checkRole(["admin"]),
  updateApplicationStatus
);

router.get("/patients", auth, checkRole(["admin"]), getAllPatients);

router.delete("/patients/:id", auth, checkRole(["admin"]), deletePatients);

router.delete("/doctors/:id", auth, checkRole(["admin"]), deleteDoctors);



// router.patch("/doctors/:id/change-role", changeDoctorToPatient);

module.exports = router;
