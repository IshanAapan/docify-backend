const { check } = require("express-validator");

exports.profileUpdateRules = [
  check("firstName").optional().isLength({ min: 4 }),
  check("lastName").optional().isLength({ min: 4 }),
  check("email").optional().isEmail(),
  check("password").optional().isLength({ min: 8 }),
  check("confirmPassword")
    .if(check("password").exists())
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => value === req.body.password),
  check("contactNumber").optional().isMobilePhone(),
  check("age").optional().isInt({ min: 1 }),
  check("gender").optional().isIn(["male", "female", "other"]),
  check("role").not().exists().withMessage("Role update not allowed"),
  check("image").not().exists().withMessage("Use image upload endpoint"),
];

exports.contactValidationRules = [
  check("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  check("message")
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters"),
];



exports.appointmentValidation = [
  check('doctorId', 'Doctor ID is required').notEmpty(),
  check('appointmentDate', 'Valid appointment date is required').isDate(),
  check('appointmentTime', 'Appointment time is required').notEmpty()
];

exports.statusValidation = [
  check('status', 'Status is required')
    .isIn(['approved', 'rejected'])
];
