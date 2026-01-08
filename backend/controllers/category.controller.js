import Category from "../models/category.model.js";
import Item from "../models/item.model.js";
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

// Get all categories
export const getAllCategoryController = async (req, res) => {
    try {
        const categories = await Category.find();

        if (!categories || categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No categories found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Categories retrieved successfully',
            count: categories.length,
            data: categories
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve categories',
            error: error.message
        });
    }
};

// Get category by ID
export const getCategoryByIdController = async (req, res) => {
    try {
        const { Id } = req.params;

        if (!Id) {
            return res.status(400).json({
                success: false,
                message: 'Category ID is required'
            });
        }

        const category = await Category.findById(Id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Category retrieved successfully',
            data: category
        });

    } catch (error) {
        console.error('Error fetching category:', error);

        // Handle invalid MongoDB ObjectId format
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID format'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve category',
            error: error.message
        });
    }
};

// Delete category
export const deleteCategoryController = async (req, res) => {
    try {
        const { Id } = req.params;
        if (!Id) {
            return res.status(400).json({
                success: false,
                message: 'Category ID is required'
            });
        }

        // Check if category exists
        const category = await Category.findById(Id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if any items are using this category
        const itemsCount = await Item.countDocuments({ category: Id });
        // Adjust field name if different: { categoryId: Id } or { item: Id }

        if (itemsCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. ${itemsCount} item(s) are using this category. Please delete the items first.`,
                itemCount: itemsCount
            });
        }

        // Delete the category
        await Category.findByIdAndDelete(Id);

        return res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
            data: category
        });

    } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete category',
            error: error.message
        });
    }
};

// Update category
export const updateCategoryController = async (req, res) => {
    try {
        const { Id } = req.params;
        const { name, Descriptions } = req.body;

        if (!Id) {
            return res.status(400).json({
                success: false,
                message: 'Category ID is required'
            });
        }

        // Check if category exists
        const category = await Category.findById(Id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // If name is being updated, check for duplicate slug
        if (name && name !== category.name) {
            const slug = slugify(name, { lower: true, strict: true, trim: true });
            const existingCategory = await Category.findOne({ slug, _id: { $ne: Id } });

            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Category with this name already exists'
                });
            }
        }

        // Update category
        const updatedCategory = await Category.findByIdAndUpdate(
            Id,
            {
                name: name || category.name,
                Descriptions: Descriptions || category.Descriptions
            },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: updatedCategory
        });

    } catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update category',
            error: error.message
        });
    }
};