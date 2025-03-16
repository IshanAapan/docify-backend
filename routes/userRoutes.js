const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { updateProfile } = require("../controllers/userController");
const { profileUpdateRules } = require("../utils/validators");

router.put("/profile", auth, profileUpdateRules, updateProfile);

module.exports = router;
