import Item from "../models/item.model.js";
import slugify from "slugify";
import Category from "../models/category.model.js";

//create category controller
export const createItemController = async (req, res) => {
    try {
        const { category, itemname, description, price, isAvailable, tags, itemImage, orderCount } = req.body;
        // Check if category exists in database
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Generate slug from itemname
        const slug = slugify(itemname, { lower: true, strict: true, trim: true });

        // Check if item already exists
        const exists = await Item.findOne({ slug });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: 'Item already exists'
            });
        }
        // Process tags array
        let arrayTag = [];
        if (tags) {
            if (Array.isArray(tags)) {
                arrayTag = tags;
            } else if (typeof tags === 'string') {
                arrayTag = tags.split(',').map(tag => tag.trim());
            } else {
                arrayTag = [tags];
            }
        }
        // Create new item
        const newItem = new Item({
            user: req.user._id,
            category,
            itemname,
            description,
            price,
            tags: arrayTag,
            isAvailable: isAvailable ?? true,
            itemImage: itemImage || [],
            orderCount: orderCount || 0
        });

        await newItem.save();

        // Populate after saving
        await newItem.populate([
            { path: 'category', select: 'name -_id' }
        ]);
        return res.status(201).json({
            success: true,
            message: 'Item created successfully',
            data: newItem
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create Item",
            error: error.message
        });
    }
};

//get item controller 
export const getItemController = async (req, res) => {
    try {
        const getitems = await Item.find()
        if (!getitems) {
            return res.status(400).json({
                success: false,
                message: "Item not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Item fetch successfully",
            getitems
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Failed to get Item'
        })
    }
}

//get item by id 
export const getItemByController = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id)
        if (!id) {  // Changed: Check if id is missing
            return res.status(400).json({
                success: false,
                message: 'Cannot find the item - ID is required'
            })
        }
        const getItem = await Item.findById(id)

        if (!getItem) {  // Added: Check if item exists
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: "Success to fetch item",
            getItem
        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: 'Failed to get item'
        })
    }
}
// Update item controller - handles updating existing menu items
export const updateItemController = async (req, res) => {
    try {
        // Extract item ID from request parameters
        const { id } = req.params;

        // Extract update fields from request body
        const { category, itemname, description, price, isAvailable, tags, itemImage, orderCount } = req.body;

        // Find the item in database
        const item = await Item.findById(id);

        // Return error if item doesn't exist
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        // Check if new itemname conflicts with existing items (excluding current item)
        if (itemname && itemname !== item.itemname) {
            const existingItem = await Item.findOne({ itemname });
            if (existingItem) {
                return res.status(400).json({
                    success: false,
                    message: 'Item name already exists'
                });
            }
        }

        // Update item with new values or keep existing ones
        const updatedItem = await Item.findByIdAndUpdate(
            id,
            {
                category: category || item.category,
                itemname: itemname || item.itemname,
                description: description || item.description,
                price: price || item.price,
                isAvailable: isAvailable !== undefined ? isAvailable : item.isAvailable,
                tags: tags || item.tags,
                itemImage: itemImage || item.itemImage,
                orderCount: orderCount || item.orderCount
            },
            { new: true, runValidators: true } // Return updated document and run validators
        );

        // Return success response with updated item
        return res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            data: updatedItem
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update item',
            error: error.message
        });
    }
};

// Delete item controller - handles removing items from the menu
export const deleteItemController = async (req, res) => {
    try {
        // Extract item ID from request parameters
        const { id } = req.params;

        // Validate ID presence
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Item ID is required'
            });
        }

        // Attempt to delete item and verify it existed
        const deletedItem = await Item.findByIdAndDelete(id);

        // Return error if item wasn't found
        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Item deleted successfully'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete item',
            error: error.message
        });
    }
};