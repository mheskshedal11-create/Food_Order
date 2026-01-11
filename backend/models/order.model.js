import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orderItems: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        itemname: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        subtotal: {
            type: Number,
            required: true
        }
    }],
    shippingAddress: {
        state: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        location: {
            type: { type: String, enum: ["Point"] },
            coordinates: { type: [Number], required: true }
        },
        placeName: String,
        mobile: String
    },

    // Pricing breakdown
    itemsPrice: {
        type: Number,
        required: true,
        min: 0
    },

    taxPrice: {
        type: Number,
        default: 0,
        min: 0
    },
    deliveryFee: {
        type: Number,
        default: 0,
        min: 0
    },

    discount: {
        type: Number,
        default: 0,
        min: 0
    },

    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'online', 'wallet', 'esewa', 'khalti'],
        required: true,
        default: 'cash'
    },

    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    // Transaction ID for online payments
    transactionId: {
        type: String
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: {
        type: Date
    },

    // Special instructions from customer
    specialInstructions: {
        type: String,
        maxlength: 500
    },
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)

export default Order
