const userModel = require("../../models/usermodel")
const updateUser = async (req, res) => {
    try {

        const sessionUser = req.userId;
        const { id, role, name, email } = req.body;

        const payload = {
            ...(email && {  email }),
            ...(name && {  name }),
            ...(role && {  role })
        }

        const user = await userModel.findById(sessionUser);

        console.log("User Id", user.role);

        const existingUser = await userModel.findById(id);
        if (!existingUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        const editUser = await userModel.findByIdAndUpdate(id, payload,{
            new:true
        });

        
           return res.status(200).json({
                message: "User Updated",
                data: editUser,
                success: true,
                error: false,
            });

        

    } catch (err) {
       return res.status(500).json({
            message: err.message || "Something went wrong",
            error: true,
            success: false
        });
    }

}

module.exports = updateUser;