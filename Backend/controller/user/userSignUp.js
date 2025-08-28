const userModel = require("../../models/usermodel");
const bcrypt = require('bcrypt');

const userSignUPController = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email) {
            throw new Error("please provide email")
        }
        if (!password) {
            throw new Error("please provide password")
        }
        if (!name) {
            throw new Error("please provide name")
        }

        const saltRounds = 10;
       
        const hash = bcrypt.hashSync(password, saltRounds);

        if (!hash) {
            throw new Error("Some thing is wrong");
        }

        const payload = {
            name,
            email,
            password: hash,
            role:"GENERAL",
        }

        const existinguser = await userModel.findOne({ email });

        if (existinguser) {
            return res.status(400).json({
                message: "Email already exists",
                success: false,
                error: true
            });
        }
        const userData = new userModel(payload)
        const saveUser = await userData.save();

        res.status(200).json({
            data: saveUser,
            success: true,
            error: false,
            message: "User created successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: err.message ||"Something went wrong",
            error: true,
            success: false
        })
    }
}

module.exports = userSignUPController;