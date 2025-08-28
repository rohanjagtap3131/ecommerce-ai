const userLogOut = async (req, res) => {
    try {
        res.clearCookie("token")


         res.status(200).json({
                message: "Logout successfully",
                data: [],
                success: true,
                error: false,
            });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Something went wrong",
            error: true,
            success: false
        });
    }
}

module.exports = userLogOut