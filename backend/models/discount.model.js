import mongoose from 'mongoose'

const discountSchema = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        default: 0

    },
    // Maximum discount amount (for percentage discounts)
    maxDiscountAmount: {
        type: Number,
        default: null
    },
    // Minimum order value required
    minOrderValue: {
        type: Number,
        default: 0
    },// Apply to specific categories
    applicableCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    // Apply to specific items
    applicableItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }],
    // If empty arrays, applies to ALL
    applicableToAll: {
        type: Boolean,
        default: false
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimit: {
        type: Number,
        default: null // null = unlimited
    },
    usedCount: {
        type: Number,
        default: 0
    },
    // Limit per user
    perUserLimit: {
        type: Number,
        default: 1
    },
}, {
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimit: {
        type: Number,
        default: null // null = unlimited
    },
    usedCount: {
        type: Number,
        default: 0
    },
    // Limit per user
    perUserLimit: {
        type: Number,
        default: 1
    },
}, { timestamps: true })

const Discount = mongoose.model('Discount', discountSchema)

export default Discount