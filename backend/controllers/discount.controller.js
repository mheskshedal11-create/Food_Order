import Discount from "../models/discount.model.js";

export const createDsicount = async (req, res) => {
    try {

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Failed to Create discount'
        })
    }
}