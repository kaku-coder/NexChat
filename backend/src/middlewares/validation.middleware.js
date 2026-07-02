import { body, validationResult } from "express-validator";

// Middleware function to handle validation errors
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            errors: errors.array().map(err => ({ field: err.path, message: err.msg })) 
        });
    }
    next();
};

// Validation rules for Registration
export const registerRules = [
    body("userName")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
    
    body("email")
        .trim()
        .isEmail().withMessage("Please enter a valid email address")
        .normalizeEmail(),
    
    body("password")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
];

// Validation rules for Login
export const loginRules = [
    body("email")
        .trim()
        .isEmail().withMessage("Please enter a valid email address")
        .normalizeEmail(),
    
    body("password")
        .notEmpty().withMessage("Password is required")
];
