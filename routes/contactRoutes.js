const express = require('express');
const router = express.Router();
const { contactValidationRules } = require('../utils/validators');
const { submitContactForm } = require('../controllers/contactController');
const auth = require('../middlewares/auth');
const { checkRole } = require('../middlewares/roleCheck');

router.post(
  '/',
  auth,
  checkRole(['patient', 'doctor']),
  contactValidationRules,
  submitContactForm
);

module.exports = router;
