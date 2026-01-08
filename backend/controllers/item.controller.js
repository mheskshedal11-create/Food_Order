import Item from "../models/item.model.js";
import slugify from "slugify";

export const createItemController = async (req, res) => {
    try {
        const { category, itemname, description, price, isAvailable, tags, itemImage, orderCount } = req.body;
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        // Validate category
        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Please select Category'
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
            { path: 'category', select: 'name' }
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