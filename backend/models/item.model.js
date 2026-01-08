import mongoose from "mongoose";
import slugify from "slugify";

const itemSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'User is required']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, 'Category is required']
    },
    itemname: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    tags: {
        type: [String],
        default: [],
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    itemImage: {
        type: [String],
        default: []
    },
    orderCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Auto-generate slug WITHOUT next() - using async function
itemSchema.pre('save', async function () {
    if (this.isModified('itemname') || this.isNew) {
        if (this.itemname) {
            this.slug = slugify(this.itemname, {
                lower: true,
                strict: true,
                trim: true
            });
        }
    }
});

// Indexes for search and filtering
itemSchema.index({ itemname: 'text', description: 'text' });
itemSchema.index({ category: 1, isAvailable: 1 });
itemSchema.index({ price: 1 });
itemSchema.index({ user: 1 });

const Item = mongoose.model("Item", itemSchema);

export default Item;