const {body} = require('express-validator');


exports.createValidator = [
    body("email").isEmail(),
    body("name").notEmpty()
];