import Category from "../models/category.model.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
    try {
        const { name, Descriptions } = req.body;
        console.log(req.body);

        // Check if category with same slug already exists
        const slug = slugify(name, { lower: true, strict: true, trim: true });
        const exists = await Category.findOne({ slug });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Category with this name already exists"
            });
        }

        // Create new category
        const newCategory = new Category({
            name,
            Descriptions
        });

        await newCategory.save();

        return res.status(201).json({ // 201 for created resource
            success: true,
            message: "Category created successfully",
            data: newCategory
        });

    } catch (error) {
        console.error("Error creating category:", error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create category",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};