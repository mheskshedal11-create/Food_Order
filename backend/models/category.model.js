import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    Descriptions: {
        type: String,
        required: true
    },
    slug: {
        type: String
    }
}, { timestamps: true });

// Use regular function, not arrow function
categorySchema.pre('save', function () {
    // Synchronous slug generation
    if (this.isModified('name') || this.isNew) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
            trim: true
        });
    }
});

const Category = mongoose.model('Category', categorySchema);

export default Category;