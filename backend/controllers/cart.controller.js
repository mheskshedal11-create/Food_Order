import Cart from "../models/cart.model.js";
import User from "../models/user.model.js"
import Item from "../models/item.model.js"

//get item 
export const getCartController = async (req, res) => {
    try {
        // Get user ID from the middleware 
        const userId = req.user._id

        // Fetch the user's cart from the database,
        let cart = await Cart.findOne({ user: userId })
            .populate('items.item', 'itemname price itemImage isAvilable')

        // If no cart is found, create a new cart object with initial empty data
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [],
                totalItems: 0,
                totalPrice: 0
            })
        }
        return res.status(200).json({
            success: true,
            data: cart
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Failed to get cart"
        })
    }
}

// add item into cart 
export const addToCartController = async (req, res) => {
    try {
        // Get user ID from the middleware
        const userId = req.user._id

        // Destructure itemId and quantity from the request body
        const { itemId, quantity } = req.body;

        // Check if user exists in the database
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        // Validate quantity to ensure it's at least 1
        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            })
        }

        // Check if the item exists in the database
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
        if (!item.isAvailable) {
            return res.status(400).json({
                success: false,
                message: 'Item is not available'
            });
        }

        // Find the user's cart or create a new one if it doesn't exist
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [],
                totalItems: 0,
                totalPrice: 0
            });
        }

        // Check if the item already exists in the cart
        const existingItemIndex = cart.items.findIndex(
            i => i.item.toString() === itemId
        )

        // If item exists in the cart, update its quantity
        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity
        } else {
            // Otherwise, add the new item to the cart
            cart.items.push({
                item: itemId,
                quantity: quantity,
                price: item.price
            });
        }

        // Update the total items and total price in the cart
        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Save the updated cart to the database
        await cart.save();

        // Populate cart item details (itemname, price, itemImage)
        await cart.populate('items.item', 'itemname price itemImage');

        // Return a successful response with the updated cart
        return res.status(200).json({
            success: true,
            message: 'Item added to cart successfully',
            data: cart
        });

    } catch (error) {
        console.log(error) // Log the error for debugging purposes
        // Return a failure response if something went wrong
        return res.status(500).json({
            success: false,
            message: "Failed to create a cart "
        })
    }
}

// udpate cart
export const updateCartItemController = async (req, res) => {
    try {
        // Get user ID from the middleware 
        const userId = req.user._Id


        const { itemId } = req.params
        const { quantity } = req.body

        // Validate quantity to ensure it is at least 1
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            })
        }

        // Fetch the user's cart from the database using userId
        const cart = await Cart.findOne(userId)


        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Find the index of the item in the cart's items array based on itemId
        const itemIndex = cart.items.findIndex(
            i => i.item.toString() === itemId
        )
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            })
        }

        // Update the quantity of the item in the cart
        cart.items[itemIndex].quantity = quantity

        // Recalculate the total items and total price after the update
        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)
        cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        // Save the updated cart back to the database
        await cart.save()

        // Populate the item details (itemname, price, itemImage) in the cart
        await cart.populate('items.item', 'itemname price itemImage')

        return res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            data: cart
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Failed to update cart',
            error: error.message // Include the error message for debugging
        })
    }
}


export const removeFromCartController = async (req, res) => {
    try {
        // Get the userId from the middleware 
        const { userId } = req.user

        // Get itemId from the route parameters
        const { itemId } = req.params

        // Find the user's cart in the database using the userId
        const cart = await Cart.findOne(userId)

        // If no cart is found for the user, return a 404 error response
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Check if the item exists in the cart by looking for a match with itemId
        const itemExists = cart.items.some(i => i.item.toString() === itemId)


        if (!itemExists) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        // Remove the item from the cart by filtering it out from the items array
        cart.items = cart.items.filter(
            i => i.item.toString() !== itemId
        );

        // Recalculate the totalItems and totalPrice after removal
        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Save the updated cart back to the database
        await cart.save();

        // Populate the cart with item details (itemname, price, itemImage)
        await cart.populate('items.item', 'itemname price itemImage');


        return res.status(200).json({
            success: true,
            message: 'Item removed from cart successfully',
            data: cart
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: 'Failed to remove',
            error: error.message
        })
    }
}

export const clearCartController = async (req, res) => {
    try {
        const { userId } = req.user;

        const cart = await Cart.findOneAndUpdate(
            { userId },
            {
                items: [],
                totalItems: 0,
                totalPrice: 0
            },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            data: cart
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to clear cart',
            error: error.message
        });
    }
};