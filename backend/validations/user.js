import { body } from 'express-validator';

export const validFullName = body('name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .bail()
    .isLength({ min: 3 }).withMessage('Full name should be minimum 3 characters')
    .bail()
    .isLength({ max: 20 }).withMessage('Full name should be maximum 20 characters')
    .bail()
    .matches(/^[A-Za-z ]+$/).withMessage('Full name should contain only letters and spaces');

export const validEmail = body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email')
    .normalizeEmail();

export const validMobile = body('mobile')
    .trim()
    .notEmpty().withMessage('Mobile number is required')
    .bail()
    .isLength({ min: 10, max: 10 })
    .withMessage('Mobile number must be exactly 10 digits')
    .bail()
    .isNumeric()
    .withMessage('Mobile number should contain only numbers');

export const validPassword = body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .bail()
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be between 6 and 20 characters')
    .bail()
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[@$!%*?&#]/).withMessage('Password must contain at least one special character');


export const registerValidation = [
    validFullName,
    validEmail,
    validPassword,
    validMobile
];

// ====================================================================
export const validEmailForLogin = body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email')
    .normalizeEmail()
    .optional();


export const validMobileForLogin = body('mobile')
    .trim()
    .notEmpty().withMessage('Mobile number is required')
    .bail()
    .isLength({ min: 10, max: 10 })
    .withMessage('Mobile number must be exactly 10 digits')
    .bail()
    .isNumeric()
    .withMessage('Mobile number should contain only numbers')
    .optional();


export const LoginValidation = [
    validEmailForLogin,
    validMobileForLogin,
    validPassword
]