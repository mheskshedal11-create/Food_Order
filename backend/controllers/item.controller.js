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

//get item conteoller 
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
        const { Id } = req.params
        if (Id) {
            return res.status(400).json({
                success: false,
                message: 'canot find the category '
            })
        }
        const getItem = await Item.findById(Id)
        return res.status(200).json({
            success: false,
            message: "success to fetch item ",
            getItem
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Failed to get item '
        })
    }
}