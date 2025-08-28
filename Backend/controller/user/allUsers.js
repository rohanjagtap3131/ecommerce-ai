const userModel = require("../../models/usermodel")
const allUsers = async (req, res) => {
    try {
         const  currentUser = req.userId;
         const allUser = await userModel.find();
         res.status(200).json({
                message: "All Users",
                data: allUser,
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

module.exports = allUsers;