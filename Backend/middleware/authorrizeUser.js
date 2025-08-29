const jwt = require('jsonwebtoken');

const authorrizeUser = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        console.log("Cookies received on request:", req.cookies);
        if (!token) {
            return res.status(401).json({
                message: "User not logged in",
                success: false,
                error: true
            });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        if (!decoded || !decoded._id) {
            return res.status(401).json({
                message: "Invalid or expired token",
                success: false,
                error: true,
            });
        }

        console.log("Decoded token:", decoded);
        req.userId = decoded._id;
        next();

    } catch (err) {
        return res.status(500).json({
            message: err.message || "Something went wrong",
            success: false,
            error: true,
        });
    }
};

module.exports = authorrizeUser;
