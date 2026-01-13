import Discount from "../models/discount.model.js";

export const createDiscountController = async (req, res) => {
    try {
        const {
            code,
            description,
            discountType,
            discountValue,
            maxDiscountAmount,
            minOrderValue,
            applicableCategories,
            applicableItems,
            applicableToAll,
            startDate,
            endDate,
            isActive,
            usageLimit,
            perUserLimit
        } = req.body;

        // Check if discount code already exists
        const existingDiscount = await Discount.findOne({ code: code.toUpperCase() });
        if (existingDiscount) {
            return res.status(400).json({
                success: false,
                message: 'Discount code already exists'
            });
        }

        // Validate percentage discount
        if (discountType === 'percentage' && discountValue > 100) {
            return res.status(400).json({
                success: false,
                message: 'Percentage discount cannot exceed 100%'
            });
        }

        // Validate date range
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end <= start) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }

        // Validate applicability logic
        if (applicableToAll && (applicableCategories?.length > 0 || applicableItems?.length > 0)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot specify categories or items when discount is applicable to all'
            });
        }

        // Create discount object
        const discountData = {
            code: code.toUpperCase(),
            description,
            discountType,
            discountValue,
            startDate: start,
            endDate: end
        };

        // Add optional fields if provided
        if (maxDiscountAmount !== undefined && maxDiscountAmount !== null) {
            discountData.maxDiscountAmount = maxDiscountAmount;
        }
        if (minOrderValue !== undefined) {
            discountData.minOrderValue = minOrderValue;
        }
        if (applicableCategories && applicableCategories.length > 0) {
            discountData.applicableCategories = applicableCategories;
        }
        if (applicableItems && applicableItems.length > 0) {
            discountData.applicableItems = applicableItems;
        }
        if (applicableToAll !== undefined) {
            discountData.applicableToAll = applicableToAll;
        }
        if (isActive !== undefined) {
            discountData.isActive = isActive;
        }
        if (usageLimit !== undefined && usageLimit !== null) {
            discountData.usageLimit = usageLimit;
        }
        if (perUserLimit !== undefined) {
            discountData.perUserLimit = perUserLimit;
        }

        // Create new discount
        const discount = await Discount.create(discountData);

        return res.status(201).json({
            success: true,
            message: 'Discount created successfully',
            data: discount
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create discount',
            error: error.message
        });
    }
};