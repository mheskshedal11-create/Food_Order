import { body } from 'express-validator'

export const discountValidation = [
    body('code')
        .notEmpty().withMessage('Please Enter Code')
        .bail()
        .isUppercase().withMessage('Enter UpperCase')
        .trim(),

    body('description')
        .isString()
        .notEmpty().withMessage('Please Enter Description')
        .bail()
        .trim(),

    body('discountType')
        .notEmpty().withMessage('Please Enter Discount Type')
        .bail()
        .isIn(['percentage', 'fixed']).withMessage('Discount type must be either percentage or fixed'),

    body('discountValue')
        .notEmpty().withMessage('Please Enter Discount Value')
        .bail()
        .isNumeric().withMessage('Discount value must be a number')
        .bail()
        .custom((value) => value >= 0).withMessage('Discount value must be greater than or equal to 0'),

    body('maxDiscountAmount')
        .optional({ nullable: true })
        .isNumeric().withMessage('Max discount amount must be a number')
        .bail()
        .custom((value) => value >= 0).withMessage('Max discount amount must be greater than or equal to 0'),

    body('minOrderValue')
        .optional()
        .isNumeric().withMessage('Minimum order value must be a number')
        .bail()
        .custom((value) => value >= 0).withMessage('Minimum order value must be greater than or equal to 0'),

    body('applicableCategories')
        .optional()
        .isArray().withMessage('Applicable categories must be an array'),

    body('applicableItems')
        .optional()
        .isArray().withMessage('Applicable items must be an array'),

    body('applicableToAll')
        .optional()
        .isBoolean().withMessage('Applicable to all must be a boolean'),

    body('startDate')
        .notEmpty().withMessage('Please Enter Start Date')
        .bail()
        .isISO8601().withMessage('Start date must be a valid date'),

    body('endDate')
        .notEmpty().withMessage('Please Enter End Date')
        .bail()
        .isISO8601().withMessage('End date must be a valid date')
        .bail()
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.startDate)) {
                throw new Error('End date must be after start date');
            }
            return true;
        }),

    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean'),

    body('usageLimit')
        .optional({ nullable: true })
        .isNumeric().withMessage('Usage limit must be a number')
        .bail()
        .custom((value) => value > 0).withMessage('Usage limit must be greater than 0'),

    body('perUserLimit')
        .optional()
        .isNumeric().withMessage('Per user limit must be a number')
        .bail()
        .custom((value) => value > 0).withMessage('Per user limit must be greater than 0')
]