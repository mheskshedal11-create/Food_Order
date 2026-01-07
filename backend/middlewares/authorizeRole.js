const authorizedRole = (...role) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'not authenticated'
            })
        }

        if (!role.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'unauthorized role'
            })
        }

        next()
    }
}

export default authorizedRole
