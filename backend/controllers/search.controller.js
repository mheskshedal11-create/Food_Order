import Item from "../models/item.model.js";

export const searchItemsController = async (req, res) => {
    try {
        const { query, category, minPrice, maxPrice, isAvailable, sortBy, page = 1, limit = 12 } = req.query
        const filter = {};

        if (query) {
            filter.itemname = { $regex: query, $options: 'i' };
        }
        if (category) {
            filter.category = category
        }
        if (minPrice || maxPrice) {
            filter.price = {}
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice)
        }
        if (isAvailable !== undefined) {
            filter.isAvailable = isAvailable === 'true'
        }
        let sort = {}
        switch (sortBy) {
            case 'price_asc':
                sort.price = 1
                break
            case 'price_desc':
                sort.price = -1
                break
            case 'name_asc':
                sort.itemname = 1
                break
            case 'name_desc':
                sort.itemname = -1
                break
            case 'newest':
                sort.createdAt = -1
                break
            default:
                sort.createdAt = -1
        }
        const skip = (page - 1) * limit
        const items = await Item.find(filter)
            .sort(sort)
            .limit(Number(limit))
            .skip(skip)
        const total = await Item.countDocuments(filter)
        return res.status(200).json({
            success: true,
            data: items,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: Number(limit)
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to Search Category"
        })
    }
}

export const getItemByIdController = async (req, res) => {
    try {
        const { itemId } = req.params
        const item = await Item.findById(itemId)
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not Found'
            })
        }
        return res.status(200).json({
            success: true,
            data: item
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to get item "
        })
    }
}

export const getAllItemsController = async (req, res) => {
    try {
        const { page = 1, limit = 12 } = req.query
        const skip = (page - 1) * limit
        const items = await Item.find()
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(skip)

        const total = await Item.countDocuments();
        return res.status(200).json({
            success: true,
            data: items,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: Number(limit)
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get items',
            error: error.message
        });
    }
}