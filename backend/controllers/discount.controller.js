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

// for discount udpate 
export const updateDiscountController = async (req, res) => {
    try {
        // Extract discount ID from URL parameters
        const discountId = req.params.id;

        // Destructure all possible fields from request body
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
        // STEP 1: Check if discount exists
        const discount = await Discount.findById(discountId);
        if (!discount) {
            return res.status(404).json({
                success: false,
                message: "Discount not found"
            });
        }
        // STEP 2: Validate unique code (if code is being updated)
        if (code) {
            // Check if another discount already uses this code
            // $ne excludes the current discount from the search
            const existingCode = await Discount.findOne({
                code: code.toUpperCase(),
                _id: { $ne: discountId }
            });

            if (existingCode) {
                return res.status(400).json({
                    success: false,
                    message: 'Discount code already exists'
                });
            }
        }

        // STEP 3: Validate percentage discount value
        // Percentage discounts cannot exceed 100%
        if (discountType === 'percentage' && discountValue > 100) {
            return res.status(400).json({
                success: false,
                message: "Percentage discount cannot be greater than 100%"
            });
        }
        // STEP 4: Validate date range
        // Only validate if both dates are provided in the update
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            // End date must be after start date
            if (end <= start) {
                return res.status(400).json({
                    success: false,
                    message: 'End date must be after start date'
                });
            }
        }
        // STEP 5: Validate applicability logic
        // Cannot have applicableToAll=true AND specific categories/items
        // Use existing values if new values aren't provided
        const checkApplicableToAll = applicableToAll !== undefined ? applicableToAll : discount.applicableToAll;
        const checkCategories = applicableCategories !== undefined ? applicableCategories : discount.applicableCategories;
        const checkItems = applicableItems !== undefined ? applicableItems : discount.applicableItems;

        if (checkApplicableToAll && (checkCategories?.length > 0 || checkItems?.length > 0)) {
            return res.status(400).json({
                success: false,
                message: "Cannot specify categories or items when discount is applicable to all"
            });
        }

        // STEP 6: Build update object
        // Only include fields that are being updated (not undefined)
        const updateData = {};

        // Update code (convert to uppercase)
        if (code !== undefined) updateData.code = code.toUpperCase();
        // Update basic text fields
        if (description !== undefined) updateData.description = description;
        // Update discount type and value
        if (discountType !== undefined) updateData.discountType = discountType;
        if (discountValue !== undefined) updateData.discountValue = discountValue;
        // Update optional discount limits
        if (maxDiscountAmount !== undefined) updateData.maxDiscountAmount = maxDiscountAmount;
        if (minOrderValue !== undefined) updateData.minOrderValue = minOrderValue;
        // Update applicability arrays
        if (applicableCategories !== undefined) updateData.applicableCategories = applicableCategories;
        if (applicableItems !== undefined) updateData.applicableItems = applicableItems;
        if (applicableToAll !== undefined) updateData.applicableToAll = applicableToAll;
        // Update date fields (convert to Date objects)
        if (startDate !== undefined) updateData.startDate = new Date(startDate);
        if (endDate !== undefined) updateData.endDate = new Date(endDate);
        // Update status and usage limits
        if (isActive !== undefined) updateData.isActive = isActive;
        if (usageLimit !== undefined) updateData.usageLimit = usageLimit;
        if (perUserLimit !== undefined) updateData.perUserLimit = perUserLimit;
        // STEP 7: Update discount in database
        const updatedDiscount = await Discount.findByIdAndUpdate(
            discountId,
            updateData,
            {
                new: true,
                runValidators: true  // Run mongoose schema validations
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Discount updated successfully',
            data: updatedDiscount
        });

    } catch (error) {
        console.log(error);

        // Send error response to client
        return res.status(500).json({
            success: false,
            message: "Failed to update discount",
            error: error.message
        });
    }
};

// for delete 
export const deleteDiscountController = async (req, res) => {
    try {
        const discountId = req.params.id;

        // Find and delete in one operation
        const deletedDiscount = await Discount.findByIdAndDelete(discountId);

        // Check if discount existed
        if (!deletedDiscount) {
            return res.status(404).json({
                success: false,
                message: 'Discount not found'
            });
        }

        // Success response
        return res.status(200).json({
            success: true,
            message: 'Discount deleted successfully',
            data: {
                deletedId: discountId,
                deletedCode: deletedDiscount.code
            }
        });

    } catch (error) {
        console.error('Delete Discount Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to delete discount',
            error: error.message
        });
    }
};