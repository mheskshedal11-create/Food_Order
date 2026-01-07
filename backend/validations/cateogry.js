import { body } from 'express-validator';

const categoryValidate = [
    body('name')
        .notEmpty().withMessage('Category name is required')
        .bail()
        .isLength({ min: 2, max: 50 }).withMessage('Name should be between 2 and 50 characters')
        .bail()
        .trim()
        .matches(/^[a-zA-Z0-9\s-]+$/).withMessage('Name can only contain letters, numbers, spaces, and hyphens'),

    body('Descriptions')
        .notEmpty().withMessage('Description is required')
        .bail()
        .isLength({ min: 10, max: 500 }).withMessage('Description should be between 10 and 500 characters')
        .bail()
        .trim()
];

export default categoryValidate;