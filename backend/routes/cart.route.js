import express from 'express';
import {
    getCartController,
    addToCartController,
    updateCartItemController,
    removeFromCartController,
    clearCartController
} from '../controllers/cart.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js';

const cartRouter = express.Router();

// Get user's cart
cartRouter.get('/', authMiddleware, getCartController);

// Add item to cart
cartRouter.post('/add', authMiddleware, addToCartController);

// Update cart item quantity
cartRouter.put('/update/:itemId', authMiddleware, updateCartItemController);

// Remove item from cart
cartRouter.delete('/remove/:itemId', authMiddleware, removeFromCartController);

// Clear entire cart
cartRouter.delete('/clear', authMiddleware, clearCartController);

export default cartRouter;