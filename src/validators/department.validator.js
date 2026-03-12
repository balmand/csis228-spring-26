const { body, validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

exports.createDepartmentValidator = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("location").trim().notEmpty().withMessage("Location is required"),
    validateRequest,
];

