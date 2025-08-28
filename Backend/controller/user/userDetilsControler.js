const userModel = require("../../models/usermodel")
const userDetialControler = async (req, res) => {
    try {
        console.log("userId from req:", req.userId);
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "No user ID found" });
        }
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

          res.status(200).json({
                message: "user is Loged-in",
                data: user,
                success: true,
                error: false,
            });
        console.log(user);
    } catch (err) {
        console.error("userDetialControler error:", err);
        res.status(500).json({ message: "Server error", error: true });
    }
}

module.exports = userDetialControler;